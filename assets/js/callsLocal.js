/// <reference path="http://code.jquery.com/jquery-1.4.1-vsdoc.js" />
/// <reference path="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js"></script>
/// <reference path="https://raw.github.com/caleb531/jcanvas/master/builds/5.2.1/jcanvas.js"></script>


//Every action should be funnelled here, which validates and maybe manipulates data

function placeCall(countryToPlace) {
    place(countryToPlace, 10); //TEMP HARDCODED
}

var attackerCountryTEMP;
var defenderCountryTEMP;
function attackCall(attackerCountry, defenderCountry) {
    log("Choose dice to attack from " + attackerCountry + " to " + defenderCountry, "user");
    //Get dice count    
    $("#dicediv").show('fast');

    boardState["Turn"]["State"] = "attackdice";

    attackerCountryTEMP = attackerCountry;
    defenderCountryTEMP = defenderCountry;
    //attack(attackerCountry, defenderCountry);
}

function stopAttack() {
    delete boardState["Turn"]["State"];
    $("#dicediv").hide('fast');
}

function attackCallback(diceAmount) {
    log("Attacking from " + attackerCountryTEMP + " to " + defenderCountryTEMP, "user");
    if (boardState["Turn"]["State"] == "attackdice") {
        attack(attackerCountryTEMP, defenderCountryTEMP, diceAmount);
    }

    stopAttack();
}

function advancetomove() {
    if (parseInt(boardState["Turn"]["Player"]) == getOurPlayerNumber()) {
        log("Entering move phase", "user");
        boardState["Turn"]["State"] = "advancingtomove";
    }
    else {
        log("Cannot enter move phase, it is not your turn", "user");
    }
}

//These are bad... but it is late
var moveFromTEMP;
var moveToTEMP;
function moveCall(moveFrom, moveTo) {
    log("Choose units to move from " + moveFrom + " to " + moveTo, "user");
    moveFromTEMP = moveFrom;
    moveToTEMP = moveTo;
    //We need to query the user for movement information (like where they want to move to)
    doDialog(moveCallConfirmed, "Enter units to move");
}
function moveCallConfirmed(menCount) {
    log("Moving from " + moveFromTEMP + " to " + moveToTEMP + " with " + menCount, "user");
    if (menCount != null) {        
        move(moveFromTEMP, moveToTEMP, menCount);
    }
}




function closeDialogYes(state) {
    boardState["PromptBox"]["result"] = "yes";
    $("#dialog").dialog('close');
}

function closeDialogNo() {
    boardState["PromptBox"]["result"] = "no";
    $("#dialog").dialog('close');
}

function dialogClosed() {
    if (isFunction(boardState["PromptBox"]["callback"])) {
        if (boardState["PromptBox"]["result"] == "yes") {
            boardState["PromptBox"]["callback"]($("textarea#dialogtextboxarea").val());
        }
        else {
            boardState["PromptBox"]["callback"](null);
        }
    }

    $("textarea#dialogtextboxarea").val("");
}

function doDialog(callBack, name) {
    $("#dialog").show('fast');
    $("#dialog").dialog({ title: name });
    $("div#dialog")["title"] = name;
    boardState["PromptBox"]["callback"] = callBack;
    $("#dialog").dialog('open');    
}