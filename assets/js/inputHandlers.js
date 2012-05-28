/// <reference path="http://code.jquery.com/jquery-1.4.1-vsdoc.js" />
/// <reference path="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js"></script>
/// <reference path="https://raw.github.com/caleb531/jcanvas/master/builds/5.2.1/jcanvas.js"></script>

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


function territoryClicked(countryNumber) {               
    var playerTurn = parseInt(boardState["Turn"]["Player"]);
    var playState = boardState["Turn"]["Stage"];

    var curPlayer = getOurPlayerNumber();

    if (playerTurn == curPlayer) {
        if (playState == "placing") {
            placeCall(countryNumber);
        }
        else if (playState == "attacking") {
            //Find if any were previously selected
            var previouslySelectedIndex = null;
            for (index in boardState.Territories) {
                if (boardState.Territories[index]["SelectedState"] == "selected") {
                    previouslySelectedIndex = index;                                
                }
            }

            //Clicked on the territory twice, they probably want to unselect it
            if (previouslySelectedIndex == countryNumber) {
                delete boardState.Territories[previouslySelectedIndex]["SelectedState"];
            }
            else {                                
                //Call attack
                if (previouslySelectedIndex != null) {
                    var owner = boardState.Territories[previouslySelectedIndex]["Owner"];
                    
                    //They probably want to move
                    if (owner == curPlayer) {                                              
                        moveCall(previouslySelectedIndex, countryNumber);
                    }
                    else {
                        attackCall(previouslySelectedIndex, countryNumber);
                    }
                }
                else {                 
                    //Set it as selected
                    delete boardState.Territories[previouslySelectedIndex];
                    boardState.Territories[countryNumber]["SelectedState"] = "selected";                    
                }                
            }                 
        }                    
    }
               
    refreshBoard();
}