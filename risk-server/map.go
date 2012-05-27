package main

import (
	"encoding/json"
	"math/rand"
	"os"
)

type Territory struct {
	dirty []bool
	Men int
	Owner int
	Connections []int
	Continent int
}

func (t *Territory) Dirty() {
	for i := range t.dirty {
		t.dirty[i] = true
	}
}

func (t *Territory) Connected(other int) bool {
	for i := range t.Connections {
		if t.Connections[i] == other {
			return true
		}
	}
	return false
}

func (g *Game) LoadMap(numplayers int, mapname string) error {
	// TODO: Un hard-code this.
	f, err := os.Open("maps/default/connections.json")
	if err != nil {
		return err
	}
	defer f.Close()
	
	dec := json.NewDecoder(f)
	err = dec.Decode(g)
	if err != nil {
		return err
	}
	
	t := g.Territories
	for i := range t {
		t[i].dirty = make([]bool, numplayers)
		for j := range t[i].dirty {
			t[i].dirty[j] = true
		}
		t[i].Men = rand.Int() % 6 + 1
		t[i].Owner = rand.Int() % numplayers;
	}
	
	return nil
}