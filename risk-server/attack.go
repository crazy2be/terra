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
	
	attdice, defdice, err := g.Attack(ad.From, ad.To, ad.Dice)
	if err != nil {
		return ar, nil
	}
	ar.AttDice = attdice
	ar.DefDice = defdice
	
	return ar, nil
}

func (g *Game) Attack(from int, to int, adice int) (attdice []int, defdice []int, err error) {
	if g.Turn.MenLeft != 0 {
		err = fmt.Errorf("You already won your battle against country %d, now you have to move men (minimum %d) there!", g.Turn.LastAttacked, g.MenLeft)
		return
	}
	
	// Validation
	if adice > 3 {
		adice = 3
	}
	
	t := g.Territories
	// TODO: Validate that territories are connected
	// TODO: Validate that from and to are within the valid range of t.
	// TODO: Move this into ValidateAttack() and add tests.
	if adice + 1 > t[from].Men {
		adice = t[from].Men - 1
	}
	ddice := 2
	if ddice > t[to].Men {
		ddice = t[to].Men
	}
	fmt.Println("Attack debug info:", adice, ddice, t[from], t[to])
	
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
	
	t[to].Men -= attwins
	t[to].Dirty()
	t[from].Men -= defwins
	t[from].Dirty()
	
	if t[to].Men == 0 {
		g.Turn.MenLeft = adice
		g.Turn.LastAttacked = to
		t[to].Owner = t[from].Owner
	}
	
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