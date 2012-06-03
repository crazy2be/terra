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


function loadJSONToBoardState(data) {
    printNiceBoardState();

    //boardState.

    MergeRecursive(boardState, JSON.parse(data));

    printNiceBoardState();

    refreshBoard();
}

function callServer(callLocation, dataIn) {
    if (dataIn == null) {
        jQuery.post(callLocation, null, loadJSONToBoardState);
    }
    else {
        $.ajax({
        type : "post",
        data : JSON.stringify(dataIn),
        cache : false,
        url : callLocation,
        dataType : "text",
        success : loadJSONToBoardState,
        error : errorRecieved
    });

        //jQuery.post(callLocation, , loadJSONToBoardState);
    }
}

function errorRecieved(request, error){
console.log(request.responseText);
}

function poll() {
    callServer("api/poll");    
}

function state() {
    callServer("api/state");    
}

var newStuff = 0;

function move(countryFrom, countryTo, menAmount) {
    var object = new Object();

    object["From"] = parseInt(countryFrom);
    object["To"] = parseInt(countryTo);
    object["Num"] = parseInt(menAmount);

    callServer("api/move", object);    
}

function place(countryNumber, placed) {
    var object = new Object();

    object["Num"] = placed;
    object["Territory"] = countryNumber;

    callServer("api/place", object);    
}

function attack(countryAttacker, countryDefender) {
    var object = new Object();

    object["From"] = parseInt(countryAttacker);
    object["To"] = parseInt(countryDefender);
    object["Dice"] = 3; //TEMP HARDCODED!

    callServer("api/attack", object);    
}