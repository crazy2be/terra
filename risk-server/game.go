package main

import (
	"github.com/bradrydzewski/routes"
	"encoding/json"
	"math/rand"
	"net/http"
	"sync"
	"sort"
	"fmt"
	"io"
)

var DEBUG_MODE = true

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
}

type Game struct {
	Players []Player
	Territories []Territory
	Turn *Turn
	tokens []string // List of valid tokens for this game
	lock sync.Mutex
}

func InitGame(numplayers int, mapfile string) *Game {
	g := new(Game)
	// TODO: Unserialize map data from JSON file here
	g.Players = make([]Player, 0, numplayers)
	g.Territories = LoadMap(numplayers, mapfile)
	return g
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
	fmt.Fprintln(w, "	\"Turn\": {")
	enc.Encode(g.Turn)
	fmt.Fprintln(w, "	},")
	fmt.Fprintln(w, "	\"Players\": {")
	for i := range g.Players {
		if !DEBUG_MODE && !g.Players[i].dirty[player] {
			continue
		}
		
		fmt.Fprintf(w, "		\"%d\": ", i)
		enc.Encode(g.Players[i])
		fmt.Fprintln(w, ",")
		
		g.Players[i].dirty[player] = false
	}
	fmt.Fprintln(w, "	},")
	fmt.Fprintln(w, "	\"Territories\": {")
	for i := range g.Territories {
		if !DEBUG_MODE && !g.Territories[i].dirty[player]{
			continue
		}
		
		fmt.Fprintf(w, "		\"%d\": ", i)
		enc.Encode(g.Territories[i])
		fmt.Fprintln(w, ",")
		
		g.Territories[i].dirty[player] = false
	}
	fmt.Fprintln(w, "	},")
	fmt.Fprintln(w, "	\"Extra\": {")
	enc.Encode(extra)
	fmt.Fprintln(w, "	},")
	fmt.Fprintln(w, "}")
}

func (g *Game) Poll(w http.ResponseWriter, r *http.Request) {
}

func (g *Game) State(w http.ResponseWriter, r *http.Request) {
	routes.ServeJson(w, g)
}

type AttackData struct {
	From int // Source territory id (attacker armies)
	To   int // defending armies
	Dice int // Number of dice rolled by attacker
}

type AttackResp struct {
	AttDice []int
	DefDice []int
}

// Attack runs a single dice roll attack
func (g *Game) AttackApi(w http.ResponseWriter, r *http.Request, playerid int) {
	// TODO: Validate player sending request has same id as owner of from territory.
	var ad AttackData
	err := decjson(r.Body, &ad)
	fmt.Println(err, "AttackData:", ad)
	attdice, defdice := g.Attack(ad.From, ad.To, ad.Dice)
	var ar AttackResp
	ar.AttDice = attdice
	ar.DefDice = defdice
	
	player := g.playerID(r.URL.Query().Get("token"))
	g.SendDelta(w, player, ar)
}

func (g *Game) Attack(from int, to int, adice int) (attdice []int, defdice []int) {
	// Validation
	if adice > 3 {
		adice = 3
	}
	// TODO: Validate that territories are connected
	// TODO: Validate that from and to are within the valid range of g.Territories.
	// TODO: Move this into ValidateAttack() and add tests.
	if adice + 1 > g.Territories[from].Men {
		adice = g.Territories[from].Men - 1
	}
	ddice := 2
	if ddice > g.Territories[to].Men {
		ddice = g.Territories[to].Men
	}
	fmt.Println("Attack debug info:", adice, ddice, g.Territories[from], g.Territories[to])
	
	// Fill dice with random numbers
	attdice = make([]int, adice)
	defdice = make([]int, ddice)
	for i := range attdice {
		attdice[i] = (rand.Int() % 6) + 1
	}
	for i := range defdice {
		defdice[i] = (rand.Int() % 6) + 1
	}
	
	// Calculate winners
	attwins, defwins := DiceBattle(attdice, defdice)
	
	g.Territories[to].Men -= attwins
	g.Territories[to].Dirty()
	g.Territories[from].Men -= defwins
	g.Territories[from].Dirty()
	
	return
}

func DiceBattle(attdice, defdice []int) (attwins, defwins int) {
	sort.Ints(attdice)
	sort.Ints(defdice)
	
	j := len(defdice) - 1
	i := len(attdice) - 1
	for i >= 0 && j >= 0 {
		adie := attdice[i]
		ddie := defdice[j]
		if adie > ddie {
			attwins++
		} else {
			defwins++
		}
		i--
		j--
	}
	return
}

func (g *Game) Place(w http.ResponseWriter, r *http.Request) {
	// TODO
}

func (g *Game) Move(w http.ResponseWriter, r *http.Request) {
	// 3TODO
}