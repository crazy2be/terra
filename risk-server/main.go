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
	defer game.Unlock()
	p := NewPlayer(c)
	game.Players = append(game.Players, p)
	playernum := l + 1
	
	randtok := genRandomToken()
	token := string(byte(playernum / 16) + '0') + string(byte(playernum % 16) + '0') + randtok
	game.tokens = append(game.tokens, token)
	
	if l + 1 == c {
		game.Start()
	}
	
	http.Redirect(w, r, fmt.Sprintf("/game/%s?token=%s", gameid, token), 302)
}

func GameHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: Un hard-code this.
	http.ServeFile(w, r, "webpage/terramain.html")
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
		w.WriteHeader(400)
		fmt.Fprintln(w, "Invalid player id", playerid)
		return
	}
	if playerid != game.Turn.Player {
		w.WriteHeader(403)
		fmt.Fprintf(w, "It's not your turn, %d. It is currently %d's turn!", playerid, game.Turn.Player)
		return
	}
	
	game.Lock()
	defer game.Unlock()
	
	var extra interface{}
	var err error
	
	switch (method) {
		// Arg: Reader that corresponds to r.Body
		// Actually could just be an object if we already
		// Know how to deserialize it.
		// Returns "extra" object and error
		// if error not nil, show 500 page with error
		// else print json delta with extra object.
		case "poll":
			extra, err = game.Poll()
		case "state":
			game.State(w, r, playerid)
			return
		case "attack":
			extra, err = game.AttackApi(r)
		case "place":
			extra, err = game.PlaceApi(r)
		case "move":
			extra, err = game.MoveApi(r)
	}
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintln(w, "Internal error:", err)
		return
	}
	game.SendDelta(w, playerid, extra)
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
	
	http.Handle("/assets/", http.FileServer(http.Dir("assets/")))
	http.Handle("/maps/", http.FileServer(http.Dir("maps/")))
	http.Handle("/", mux)
	
	http.ListenAndServe(":8088", nil)
}