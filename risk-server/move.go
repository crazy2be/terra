package main

import (
	"encoding/json"
	"net/http"
	"fmt"
)

type MoveData struct {
	From int
	To   int
	Num  int
}

func (g *Game) MoveApi(r *http.Request) (interface{}, error) {
	var md MoveData
	
	dec := json.NewDecoder(r.Body)
	err := dec.Decode(&md)
	if err != nil {
		return nil, err
	}
	
	return nil, g.Move(md.From, md.To, md.Num)
}

func (g *Game) Move(from, to, num int) error {
	t := g.Territories
	if t[from].Owner != g.Turn.Player {
		return fmt.Errorf("Player %d is not allowed to move men from territory %d, as it is owned by player %d.", g.Turn.Player, from, t[from].Owner)
	}
	if t[to].Owner != g.Turn.Player {
		return fmt.Errorf("Player %d is not allowed to move men to territory %d, as it is owned by player %d.", g.Turn.Player, to, t[to].Owner)
	}
	if !t[from].Connected(to) {
		return fmt.Errorf("Country %d is not connected to country %d, unable to move troops!", from, to)
	}
	if t[from].Men - 1 < num {
		return fmt.Errorf("Unable to move %d men from country %d, only %d men reside there (and you must leave at least one behind).", num, from, t[from].Men)
	}
	if g.Turn.MenLeft != 0 {
		if g.Turn.MenLeft > num {
			return fmt.Errorf("You just attacked territory %d, you must move a minimum of %d men!", g.Turn.LastAttacked, g.Turn.MenLeft)
		}
		if to != g.Turn.LastAttacked {
			return fmt.Errorf("You just attacked territory %d, you must move your men there, not to territory %d.", g.Turn.LastAttacked, to)
		}
	}
	t[from].Men -= num
	t[from].Dirty()
	t[to].Men += num
	t[to].Dirty()
	if g.Turn.MenLeft != 0 {
		g.Turn.MenLeft = 0
		g.Turn.LastAttacked = -1
		return nil
	}
	g.NextPlayer()
	return nil
}