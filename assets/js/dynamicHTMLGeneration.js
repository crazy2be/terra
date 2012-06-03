/// <reference path="http://code.jquery.com/jquery-1.4.1-vsdoc.js" />
/// <reference path="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js"></script>
/// <reference path="https://raw.github.com/caleb531/jcanvas/master/builds/5.2.1/jcanvas.js"></script>

function generateDynamicHTML() {

    //Dynamically loads the image map    
    var mapeventsHTML = document.getElementsByName("mapevents")[0];

    for (index in boardState.Territories) {
        var myArea = document.createElement('area');

        myArea.setAttribute('class', 'territory');
        myArea.setAttribute('shape', 'poly');
        myArea.setAttribute('id', index);
        myArea.setAttribute('coords', boardState.Territories[index].Coords);
        myArea.setAttribute('onmouseover', 'territoryMouseOver(' + index + ', ' +
                    boardState.Territories[index].CenterLocation.x + ', ' +
                    boardState.Territories[index].CenterLocation.y + ')');

        myArea.setAttribute('onmouseout', 'territoryMouseOut(' + index + ', ' +
                    boardState.Territories[index].CenterLocation.x + ', ' +
                    boardState.Territories[index].CenterLocation.y + ')');

        myArea.setAttribute('onclick', 'territoryClicked(' + index + ')');

        mapeventsHTML.appendChild(myArea);
    }
    

    
    $("#dialog").dialog({
        width : 300,
        height : 200,
        close: dialogClosed,     
        autoOpen : false   
    });

    $("#dialogbuttonyes").click(closeDialogYes);
    $("#dialogbuttonno").click(closeDialogNo);

    //alert();
    
    //document.getElementById("maintextoutputarea").disabled = true;​​​​

    //$( "input:submit, a, button" ).button();
}