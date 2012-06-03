/// <reference path="http://code.jquery.com/jquery-1.4.1-vsdoc.js" />
/// <reference path="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js"></script>
/// <reference path="https://raw.github.com/caleb531/jcanvas/master/builds/5.2.1/jcanvas.js"></script>
/// <reference path="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.js">


function refreshBoard() {
    //Clear current canvas
    $("canvas").clearCanvas({
        x: 0, y: 0,
        width: MAP_WIDTH,
        height: MAP_HEIGHT,
        fromCenter: false
    });

    //get data
    var curPlayer = getOurPlayerNumber();

    for (index in boardState.Territories) {
        var curPlace = boardState.Territories[index];

        var centX = curPlace["CenterLocation"].x;
        var centY = curPlace["CenterLocation"].y;
        
        var owner = curPlace["Owner"];

        if (owner == curPlayer) {
            drawText(curPlace["Men"], centX, centY, ourSelectedColorSolid, ourSelectedColorLight);
        }
        else {
            drawText(curPlace["Men"], centX, centY, enemySelectedColorSolid, enemySelectedColorLight);
        }

        if (curPlace["SelectedState"] == "selected") {
            if (owner == curPlayer) {                
                drawStandardFadeoutCircle(
                        curPlace["CenterLocation"].x,
                        curPlace["CenterLocation"].y,
                        30, ourSelectedColor, ourSelectedColorAlpha);
            }
            else {
                drawStandardFadeoutCircle(
                        curPlace["CenterLocation"].x,
                        curPlace["CenterLocation"].y,
                        30, enemySelectedColor, enemySelectedColorAlpha);
            }
        }

        if (curPlace["Mouseover"] != null &&
        curPlace["Mouseover"] == true) {            
            if (curPlayer == owner) {
                drawStandardFadeoutCircle(
                    curPlace["CenterLocation"].x,
                    curPlace["CenterLocation"].y,
                    30, ourSelectedColor, ourSelectedColorAlpha);
            }
            else {
                drawStandardFadeoutCircle(
                    curPlace["CenterLocation"].x,
                    curPlace["CenterLocation"].y,
                    30, enemySelectedColor, enemySelectedColorAlpha);
            }
        }
    }

    //if (boardState["PromptBox"]["visible"]) {
        
        //drawGradientBox(boardState["PromptBox"]["xPos"], boardState["PromptBox"]["yPos"],
          //  boardState["PromptBox"]["width"], boardState["PromptBox"]["height"], dialogColorOne, dialogColorTwo);
    //}

    //curPlayer says who we are!
    var playerTurn = parseInt(boardState["Turn"]["Player"]);

    if (curPlayer != playerTurn) {        
        $("#curturn").text(playerTurn);
    }
    else {        
        $("#curturn").text(playerTurn + " (you)");
    }

    $("#curstage").text(boardState["Turn"]["Stage"]);
    $("#curstate").text(boardState["Turn"]["State"]);
    $("#menleft").text(boardState["Turn"]["MenLeft"]);
}