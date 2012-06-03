/// <reference path="http://code.jquery.com/jquery-1.4.1-vsdoc.js" />
/// <reference path="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js"></script>
/// <reference path="https://raw.github.com/caleb531/jcanvas/master/builds/5.2.1/jcanvas.js"></script>

function territoryClicked(countryNumber) {        
    var playerTurn = parseInt(boardState["Turn"]["Player"]);
    var playState = boardState["Turn"]["Stage"];

    var curPlayer = getOurPlayerNumber();

    var curState = boardState["Turn"]["State"];

    //Get rid of this code
    var previouslySelectedIndex = null;
    for (index in boardState.Territories) {
        if (boardState.Territories[index]["SelectedState"] == "selected") {
            previouslySelectedIndex = index;
        }
    }

    log(1);
    if (playerTurn != curPlayer) {
        log("You cannot do anything, it is not your turn.", "user");
        return;
    }
    else if (curState == "movechoose") {
        log("Either cancel your move or enter a men number.", "user");
    }
    else if (playState == "placing")  //place
    {
        placeCall(countryNumber);
    }
    else if (previouslySelectedIndex == null) //select
    {        
        boardState.Territories[countryNumber]["SelectedState"] = "selected";
    }
    else if (previouslySelectedIndex == countryNumber) //deselect
    {
        delete boardState.Territories[previouslySelectedIndex]["SelectedState"];
    }    
    else if (playState == "advancingtomove") //move
    {
        moveCall(previouslySelectedIndex, countryNumber);
    }
    else if (playState == "attacking") //attack
    {        
        var owner = boardState.Territories[countryNumber]["Owner"];

        attackCall(previouslySelectedIndex, countryNumber);
    }                 
                   
    refreshBoard();
}

function dialogKeyDown(event) {
    if (event.keyCode == 13) {
        $("#dialogbuttonyes").click();
    }
}