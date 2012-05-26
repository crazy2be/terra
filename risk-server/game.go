package main

import (
	"github.com/bradrydzewski/routes"
	"encoding/json"
	"net/http"
	"fmt"
	"io"
)

type Player struct {
	dirty []bool
	Color string
}

type Game struct {
	Players []Player
	Territories []Territory
}

func InitGame(numplayers int, mapfile string) *Game {
	g := new(Game)
	g.Players = make([]Player, numplayers)
	for i := range g.Players {
		g.Players[i].dirty = make([]bool, numplayers)
	}
	g.Players[0].dirty[0] = true // REMOVEME
	g.Territories = LoadMap(numplayers, mapfile)
	return g
}

func decjson(wc io.ReadCloser, data interface{}) error {
	dec := json.NewDecoder(wc)
	return dec.Decode(data)
}

// playerID returns a player's numeric id given a their auth token.
func (g *Game) playerID(token string) int {
	return 0
}

func (g *Game) Poll(w http.ResponseWriter, r *http.Request) {
	// TODO: Make this function send delta rather than the whole state.
	player := g.playerID(r.URL.Query().Get("token"))
	enc := json.NewEncoder(w)
	fmt.Fprintln(w, "{")
	fmt.Fprintln(w, "	\"Players\": {")
	for i := range g.Players {
		if !g.Players[i].dirty[player] {
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
		if !g.Territories[i].dirty[player] {
			continue
		}
		
		fmt.Fprintf(w, "		\"%d\": ", i)
		enc.Encode(g.Territories[i])
		fmt.Fprintln(w, ",")
		
		g.Territories[i].dirty[player] = false
	}
	fmt.Fprintln(w, "	},")
	fmt.Fprintln(w, "}")
}

func (g *Game) State(w http.ResponseWriter, r *http.Request) {
	routes.ServeJson(w, g)
}

type AttackData struct {
	From int // Source territory id (attacker armies)
	To   int // defending armies
	Dice int // Number of dice rolled by attacker
}
// Attack runs a single dice roll attack
func (g *Game) Attack(w http.ResponseWriter, r *http.Request) {
	var ad AttackData
	decjson(r.Body, &ad)
	fmt.Println(ad)
	// TODO
}

func (g *Game) Place(w http.ResponseWriter, r *http.Request) {
	// TODO
}

func (g *Game) Move(w http.ResponseWriter, r *http.Request) {
	// 3TODO
}