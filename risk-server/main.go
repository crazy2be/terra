package main

import (
	"github.com/bradrydzewski/routes"
	"math/rand"
	"net/http"
	"strconv"
	"sync"
	"fmt"
	"os"
)

func CreateUIHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	fmt.Fprintln(w, `Create a new game!
<form method="post" action="/create">
	<input type="text" name="gameid" value="Gameid" />
	<input type="text" name="numplayers" value="Number of players" />
	<input type="submit" value="Here!" />
</form>`)
}

func CreateHandler(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		w.WriteHeader(400)
		fmt.Fprintln(w, "Unable to parse form data!:", err)
		return
	}
	// TODO: Autogenerate gameid
	gameid := r.Form.Get("gameid")
	numplayerss := r.Form.Get("numplayers")
	numplayers, err := strconv.Atoi(numplayerss)
	if err != nil {
		w.WriteHeader(400)
		fmt.Fprintln(w, "Invalid number of players (%s), must be an integer.", numplayerss)
		return
	}
	
	allGamesM.Lock()
	allGames[gameid] = InitGame(numplayers, "")
	allGamesM.Unlock()
	
	http.Redirect(w, r, "/join/"+gameid, 302)
}

func JoinGameUIHandler(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	gameid := params.Get(":id")
	
	w.Header().Set("Content-Type", "text/html")
	fmt.Fprintf(w, `Join this game (id %s) by clicking
	<form method="post" action="/join/%s">
		<input type="submit" value="Here!" />
	</form>`, gameid, gameid)
}

func genRandomToken() string {
	s := ""
	from := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	for i := 0; i < 20; i++ {
		s += string(from[rand.Int() % len(from)])
	}
	return s
}

func JoinGameHandler(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	gameid := params.Get(":id")
	
	allGamesM.Lock()
	game, exists := allGames[gameid]
	allGamesM.Unlock()
	
	if !exists {
		w.WriteHeader(404)
		fmt.Fprintln(w, "No game with id", gameid, "found! Try another id...")
		return
	}
	
	l := len(game.Players)
	c := cap(game.Players)
	if l == c {
		w.WriteHeader(500)
		fmt.Fprintln(w, "Sorry, that game is full. It currently has", l, "players, and was only set up to accept", c, "players.")
		return
	}
	
	game.Lock()
	p := NewPlayer(c)
	game.Players = append(game.Players, p)
	
	randtok := genRandomToken()
	token := string(byte(c / 16) + '0') + string(byte(c % 16) + '0') + randtok
	game.tokens = append(game.tokens, token)
	game.Unlock()
	
	http.Redirect(w, r, fmt.Sprintf("/game/%s?token=%s", gameid, token), 302)
}

func GameHandler(w http.ResponseWriter, r *http.Request) {
	
}

var allGamesM sync.Mutex
var allGames map[string]*Game = make(map[string]*Game, 1)

func ApiHandler(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	gameid := params.Get(":id")
	method := params.Get(":method")
	
	allGamesM.Lock()
	game := allGames[gameid]
	allGamesM.Unlock()
	
	token := params.Get("token")
	if !game.tokenValid(token) {
		w.WriteHeader(403)
		fmt.Fprintln(w, "Invalid token", token)
		return
	}
	
	playerid := game.playerID(token)
	if playerid < 0 || playerid > len(game.Players) {
		w.WriteHeader(403)
		fmt.Fprintln(w, "Invalid player id", playerid)
		return
	}
	
	game.Lock()
	switch (method) {
		case "poll":
			game.Poll(w, r)
		case "state":
			game.State(w, r)
		case "attack":
			game.AttackApi(w, r, playerid)
		case "place":
			game.Place(w, r)
		case "move":
			game.Move(w, r)
	}
	game.Unlock()
}

func main() {
	allGames["0"] = InitGame(5, "not used yet")
	allGames["0"].SendDelta(os.Stdout, 1, nil)
	
	mux := routes.New()
	mux.Get("/create", CreateUIHandler)
	mux.Post("/create", CreateHandler)
	
	mux.Get("/join/:id", JoinGameUIHandler)
	mux.Post("/join/:id", JoinGameHandler)
	
	mux.Get("/game/:id", GameHandler)
	mux.Post("/game/:id/api/:method", ApiHandler)
	
	http.Handle("/", mux)
	http.ListenAndServe(":8088", nil)
}