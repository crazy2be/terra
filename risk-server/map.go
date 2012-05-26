package main

import (
	"math/rand"
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

func LoadMap(numplayers int, mapname string) []Territory {
	t := make([]Territory, 10)
	for i := range t {
		// All territories should be dirty for all players to start.
		t[i].dirty = make([]bool, numplayers)
		for j := range t[i].dirty {
			t[i].dirty[j] = true
		}
		
		t[i].Men = rand.Int() % 5
		t[i].Owner = rand.Int() % numplayers;
		t[i].Connections = make([]int, rand.Int() % 4)
		c := t[i].Connections
		for j := range c {
			c[j] = rand.Int() % 10
		}
		t[i].Continent = rand.Int() % 2;
	}
	return t
}