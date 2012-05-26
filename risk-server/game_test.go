package main

import (
	"testing"
)

func AssertEqual(t *testing.T, test, exp, res interface{}, desc string) {
	if exp != res {
		t.Errorf("Expected %#v but got %#v %s (Data %#v)", exp, res, desc, test)
	} else {
		t.Logf("Expected and got %#v %s (Data %#v)", exp, desc, test)
	}
}

func TestDiceBattle(t *testing.T) {
	tests := [...][2][]int {
		{{1, 6, 3}, {6, 2}},
	}
	results := [...][2]int {
		{1, 1},
	}
	for i := range tests {
		awin, dwin := DiceBattle(tests[i][0], tests[i][1])
		AssertEqual(t, tests[i], awin, results[i][0], "attacker wins")
		AssertEqual(t, tests[i], dwin, results[i][1], "defender wins")
	}
}