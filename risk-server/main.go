package main

import (
	"github.com/bradrydzewski/routes"
	"net/http"
)

func GameHandler(w http.ResponseWriter, r *http.Request) {
	
}

var allGames map[string]*Game = make(map[string]*Game, 1)

func ApiHandler(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	id := params.Get(":id")
	method := params.Get(":method")
	switch (method) {
		case "poll":
			allGames[id].Poll(w, r)
		case "state":
			allGames[id].State(w, r)
		case "attack":
			allGames[id].Attack(w, r)
		case "place":
			allGames[id].Place(w, r)
		case "move":
			allGames[id].Move(w, r)
	}
}

func main() {
	allGames["0"] = InitGame(5, "not used yet")
	
	mux := routes.New()
	mux.Get("/game/:id", GameHandler)
	mux.Post("/game/:id/api/:method", ApiHandler)
	
	http.Handle("/", mux)
	http.ListenAndServe(":8088", nil)
}