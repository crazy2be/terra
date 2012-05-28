/// <reference path="http://code.jquery.com/jquery-1.4.1-vsdoc.js" />
/// <reference path="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js"></script>
/// <reference path="https://raw.github.com/caleb531/jcanvas/master/builds/5.2.1/jcanvas.js"></script>
/// <reference path="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.js">

// global helper functions and variables -->
/// <reference path="http://localhost:8088/assets/js/global.js"></script>
// boardState and custom click data loading -->
/// <reference path="http://localhost:8088/assets/js/polyBoardState.js"></script>               
// handlers from HTML events -->
/// <reference path="http://localhost:8088/assets/js/inputHandlers.js"> </script>

// wrappers for calls to the server -->
/// <reference path="http://localhost:8088/assets/js/serverCalls.js"></script>

// draw functions, and maybe some global variables related to drawing -->
/// <reference path="http://localhost:8088/assets/js/globalDraw.js"> </script>
// main temporary draw handlers -->
/// <reference path="http://localhost:8088/assets/js/tempDrawHandlers.js"></script>
// redraw all handlers -->
/// <reference path="http://localhost:8088/assets/js/mainDraw.js"></script>

// all dynamically generated html functions-->
/// <reference path="http://localhost:8088/assets/js/dynamicHTMLGeneration.js"></script>

// wrappers on server calls so we can call them directly-->
/// <reference path="http://localhost:8088/assets/js/serverCalls.js"></script>

// on page load (just call other stuff in here) -->
/// <reference path="http://localhost:8088/assets/js/onPageLoad.js"></script>

// main game function calls
/// <reference path="http://localhost:8088/assets/js/mainFunctionCalls.js"> </script>

// global entry point (DON'T RUN ANYTHING GLOBALLY ANYWHERE BUT HERE!) -->
/// <reference path="http://localhost:8088/assets/js/globalEntryPoint.js"> </script>

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

        drawText(curPlace["Men"], centX, centY);

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
    }

    //if (boardState["PromptBox"]["visible"]) {
        
        //drawGradientBox(boardState["PromptBox"]["xPos"], boardState["PromptBox"]["yPos"],
          //  boardState["PromptBox"]["width"], boardState["PromptBox"]["height"], dialogColorOne, dialogColorTwo);
    //}
}