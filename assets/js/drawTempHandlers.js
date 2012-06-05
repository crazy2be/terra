/// <reference path="http://code.jquery.com/jquery-1.4.1-vsdoc.js" />
/// <reference path="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js"></script>
/// <reference path="https://raw.github.com/caleb531/jcanvas/master/builds/5.2.1/jcanvas.js"></script>


function territoryMouseOver(countryNumber, centerX, centerY) {    
    if (getUrlVars()["mouseover"] == "true")
        log("mouseover" + (new Date()).getMilliseconds(), "test");

    var curPlayer = getOurPlayerNumber();

    var owner = boardState.Territories[countryNumber]["Owner"];
    
    boardState.Territories[countryNumber]["Mouseover"] = true;    

    refreshBoard();        
}

function territoryMouseOut(countryNumber, centerX, centerY) {
    //Not needed now that we call refreshBoard
    //$("canvas").clearCanvas({
    //    x: centerX, y: centerY,
    //    radius: 30
    //});          
    boardState.Territories[countryNumber]["Mouseover"] = false;      
    refreshBoard();
}