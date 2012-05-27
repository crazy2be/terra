package main

import (
	"github.com/bradrydzewski/routes"
	"encoding/json"
	"math/rand"
	"net/http"
	"sync"
	"fmt"
	"io"
)

var DEBUG_MODE = false

type Player struct {
	dirty []bool
}

func NewPlayer(numplayers int) Player {
	var p Player
	p.dirty = make([]bool, numplayers)
	for i := range p.dirty {
		p.dirty[i] = true
	}
	return p
}

type Turn struct {
	Player int
	Stage  string
	MenLeft int // Men left to place (in the placing stage)
}

type Continent struct {
	Bonus int
}

type Game struct {
	Players []Player
	Territories []Territory
	Continents []Continent
	Turn
	tokens []string // List of valid tokens for this game
	lock sync.Mutex
}

func InitGame(numplayers int, mapfile string) *Game {
	g := new(Game)
	g.Turn.Player = -1
	g.Turn.Stage = "waiting for players"
	// TODO: Unserialize map data from JSON file here
	g.Players = make([]Player, 0, numplayers)
	err := g.LoadMap(numplayers, mapfile)
	if err != nil {
		panic(err)
	}
	return g
}

func (g *Game) Start() {
	g.Turn.Player = (rand.Int() % len(g.Players)) - 1
	g.NextPlayer()
}

func (g *Game) NextPlayer() {
	g.Turn.Player = (g.Turn.Player + 1) % len(g.Players)
	g.Turn.Stage = "placing"
	g.Turn.MenLeft = g.CalcStartingMen(g.Turn.Player)
}

func (g *Game) CalcStartingMen(player int) int {
	owned := 0
	continents := make([]bool, len(g.Continents))
	for i := range continents {
		continents[i] = true
	}
	
	for i := range g.Territories {
		t := g.Territories[i]
		if t.Owner == player {
			owned++
		} else {
			continents[t.Continent] = false
		}
	}
	
	bonus := owned / 3
	for i := range continents {
		if continents[i] {
			bonus += g.Continents[i].Bonus
		}
	}
	return bonus
}

func (g *Game) Lock() {
	g.lock.Lock()
}

func (g *Game) Unlock() {
	g.lock.Unlock()
}

func decjson(wc io.ReadCloser, data interface{}) error {
	dec := json.NewDecoder(wc)
	return dec.Decode(data)
}

// playerID returns a player's numeric id given a their auth token.
func (g *Game) playerID(token string) int {
	return int((token[0] - '0'))*16 + int(token[1] - '0')
}

// tokenValid checks the given token against the list of authorized tokens. 
func (g *Game) tokenValid(token string) bool {
	for _, tok := range g.tokens {
		if tok == token {
			return true
		}
	}
	return false
}

func (g *Game) SendDelta(w io.Writer, player int, extra interface{}) {
	enc := json.NewEncoder(w)
	fmt.Fprintln(w, "{")
	fmt.Fprintln(w, "	\"Extra\": {")
	if extra != nil {
		enc.Encode(extra)
	}
	fmt.Fprintln(w, "	},")
	fmt.Fprintln(w, "	\"Players\": {")
	first := true
	for i := range g.Players {
		if !DEBUG_MODE && !g.Players[i].dirty[player] {
			continue
		}
		
		if !first {
			fmt.Fprintf(w, ",")
		}
		first = false
		fmt.Fprintf(w, "		\"%d\": ", i)
		enc.Encode(g.Players[i])
		
		g.Players[i].dirty[player] = false
	}
	fmt.Fprintln(w, "	},")
	fmt.Fprintln(w, "	\"Territories\": {")
	first = true
	for i := range g.Territories {
		if !DEBUG_MODE && !g.Territories[i].dirty[player]{
			continue
		}
		
		if !first {
			fmt.Fprintf(w, ",")
		}
		first = false
		fmt.Fprintf(w, "		\"%d\": ", i)
		enc.Encode(g.Territories[i])
		
		g.Territories[i].dirty[player] = false
	}
	fmt.Fprintln(w, "	},")
	fmt.Fprintln(w, "	\"Turn\": ")
	enc.Encode(g.Turn)
	fmt.Fprintln(w, "}")
}

func (g *Game) Poll() (interface{}, error) {
	return nil, nil
}

func (g *Game) State(w http.ResponseWriter, r *http.Request, playerid int) {
	routes.ServeJson(w, g)
}