package main

import (
	"net/http"
	"fmt"
)

type CaptureData struct {
	Num int // Number of armies to move into captured territory. Must be >= g.Attack.Dice.
}

func (g *Game) CaptureApi(r *http.Request) (interface{}, error) {
	var cd CaptureData
	
	err := decjson(r.Body, &cd)
	if err != nil {
		return nil, err
	}
	
	err = g.Capture(cd.Num)
	if err != nil {
		return nil, err
	}
	
	return nil, nil
}

func (g *Game) Capture(num int) error {
	a := g.Turn.Attack
	if a == nil {
		return fmt.Errorf("You have not defeated any territory, calling Capture() is invalid!")
	}
	if num < a.Dice {
		return fmt.Errorf("You rolled %d dice, therefore you must move a minimum of %d men.", a.Dice, a.Dice)
	}
	
	t := g.Territories
	t[a.To].Dirty()
	t[a.From].Dirty()
	t[a.To].Owner = t[a.From].Owner
	
	t[a.To].Men += num
	t[a.From].Men -= num
	
	g.Turn.Attack = nil
	
	return nil
}