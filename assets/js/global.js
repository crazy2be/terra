/// <reference path="http://code.jquery.com/jquery-1.4.1-vsdoc.js" />
/// <reference path="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js"></script>
/// <reference path="https://raw.github.com/caleb531/jcanvas/master/builds/5.2.1/jcanvas.js"></script>

var mapPath = "http://localhost:8088/assets/riskmap_en_small.png";

var MAP_WIDTH = 800;
var MAP_HEIGHT = 600;

//ATTENTION! This does not properly transfer arrays, only objects
function MergeRecursive(obj1, obj2) {
    for (var p in obj2) {
        try {
            // Property in destination object set; update its value.
            if (obj2[p].constructor == Object) {
                obj1[p] = MergeRecursive(obj1[p], obj2[p]);

            } else {
                obj1[p] = obj2[p];
            }

        } catch (e) {
            // Property in destination object not set; create it and set its value.                
            obj1[p] = obj2[p];
        }
    }
    return obj1;
}

//from http://www.w3schools.com/js/js_cookies.asp
function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

function printNiceBoardState() {
    var copiedBoard = JSON.parse(JSON.stringify(boardState));

    for (index in copiedBoard.Territories) {
        delete copiedBoard.Territories[index]["Coords"];
        delete copiedBoard.Territories[index]["CenterLocation"];
    }

    log(JSON.stringify(copiedBoard), "nice board");
}

function printFullBoardState() {
    log(JSON.stringify(boardState), "full board");    
}

function getOurPlayerNumber() {
    return parseInt(getCookie("token").substr(0, 2));
}

//http://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type
function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
}


//decides when error codes are shown, can be dynamically added to
var errorCodes = {
    "test": { user: true, console: false, debugOnly: true, alert: true },
    "nice board": { user: false, console: false, debugOnly: true, alert: false },
    "full board": { user: false, console: false, debugOnly: true, alert: false },
    "server 500": { user: true, console: true, debugOnly: false, alert: false },
    "user": { user: true, console: false, debugOnly: true, alert: false },
    "servercall": { user: true, console: false, debugOnly: true, alert: false },
    "unknown": { user: true, console: false, debugOnly: true, alert: false },    
};
var textDisplayToUser = ""; //Eventually this should be an array, that is cleared or something
function log(message, code) {
    for (var index in errorCodes)
    {
        if (code == index) 
        {
            if (errorCodes[index].user) {
                textDisplayToUser += "\n" + message;
                $("#maintextoutputarea").text(textDisplayToUser);                
                maintextoutputarea.scrollTop = maintextoutputarea.scrollHeight;
                //$("#maintextoutputarea").scrollTop($("#maintextoutputarea").scrol
            }
            if (errorCodes[index].console) 
            {
                console.log(message);
            }
            if (errorCodes[index].debugMode) 
            {
                
            }
            if (errorCodes[index].alert) 
            {
                alert(message);
            }
            return;
        }
    }

    message = "unknown message: " + message;
    if (errorCodes["unknown"].user) 
    {
        textDisplayToUser += "\n" + message;
        $("#maintextoutputarea").text(textDisplayToUser);                
        maintextoutputarea.scrollTop = maintextoutputarea.scrollHeight;
        //$("#maintextoutputarea").scrollTop($("#maintextoutputarea").scrol
    }
    if (errorCodes["unknown"].console) 
    {
        console.log(message);
    }
    if (errorCodes["unknown"].debugMode) 
    {
                
    }
    if (errorCodes["unknown"].alert) 
    {
        alert(message);
    }
    return;
        
}