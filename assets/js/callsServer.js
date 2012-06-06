/// <reference path="http://code.jquery.com/jquery-1.4.1-vsdoc.js" />
/// <reference path="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js"></script>
/// <reference path="https://raw.github.com/caleb531/jcanvas/master/builds/5.2.1/jcanvas.js"></script>

function callServer(callLocation, dataIn) {
    if (dataIn == null) {
        jQuery.post(callLocation, null, loadJSONToBoardState);
    }
    else 
    {
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

function errorRecieved(request, error) {
    log(request.responseText, "server 500");
}

function poll() {
    callServer("api/poll");    
}

function getState() {
    callServer("api/state");    
}

var newStuff = 0;

function move(countryFrom, countryTo, menAmount) {
    log("Calling server move: " + countryFrom + " to " + countryTo + " with " + menCount, "servercall");
    var object = new Object();

    object["From"] = parseInt(countryFrom);
    object["To"] = parseInt(countryTo);
    object["Num"] = parseInt(menAmount);

    callServer("api/move", object);    
}

function place(countryNumber, placed) {
    log("Calling server place: " + countryNumber + " with " + placed, "servercall");
    var object = new Object();

    object["Num"] = placed;
    object["Territory"] = countryNumber;

    callServer("api/place", object);    
}

function attack(countryAttacker, countryDefender, diceCount) {
    log("Calling server attack: " + countryAttacker + " to " + countryDefender + " with " + diceCount, "servercall");
    var object = new Object();

    object["From"] = parseInt(countryAttacker);
    object["To"] = parseInt(countryDefender);
    object["Dice"] = diceCount;

    callServer("api/attack", object);    
}