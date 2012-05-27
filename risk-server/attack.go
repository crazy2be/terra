package main

import (
	"math/rand"
	"net/http"
	"sort"
	"fmt"
)

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
func (g *Game) AttackApi(r *http.Request) (extra AttackResp, err error) {
	// TODO: Validate player sending request has same id as owner of from territory.
	var ad AttackData
	var ar AttackResp
	
	err = decjson(r.Body, &ad)
	fmt.Println(err, "AttackData:", ad)
	if err != nil {
		return ar, err
	}
	
	attdice, defdice := g.Attack(ad.From, ad.To, ad.Dice)
	ar.AttDice = attdice
	ar.DefDice = defdice
	
	return ar, nil
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