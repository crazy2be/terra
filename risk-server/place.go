package main

import (
	"encoding/json"
	"net/http"
	"fmt"
)

type PlaceData struct {
	Territory int
	Num       int
}

func (g *Game) PlaceApi(r *http.Request) (interface{}, error) {
	var pd PlaceData
	
	dec := json.NewDecoder(r.Body)
	err := dec.Decode(&pd)
	if err != nil {
		return nil, err
	}
	
	return nil, g.Place(pd.Territory, pd.Num)
}

func (g *Game) Place(territory, num int) error {
	if g.Turn.MenLeft <= 0 {
		return fmt.Errorf("Sorry, you don't have any men to place!")
	}
	if g.Turn.MenLeft < num {
		num = g.Turn.MenLeft
	}
	where := g.Territories[territory]
	if where.Owner != g.Turn.Player {
		return fmt.Errorf("Sorry, player %d isn't allowed to place in territory %d (that's owned by player %d)", g.Turn.Player, territory, where.Owner)
	}
	where.Men += num
	where.Dirty()
	g.Turn.MenLeft -= num
	g.Territories[territory] = where
	if g.Turn.MenLeft == 0 {
		g.Turn.Stage = "attacking"
	}
	return nil
}
