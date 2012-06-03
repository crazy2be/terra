/// <reference path="http://code.jquery.com/jquery-1.4.1-vsdoc.js" />
/// <reference path="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js"></script>
/// <reference path="https://raw.github.com/caleb531/jcanvas/master/builds/5.2.1/jcanvas.js"></script>


function pageLoaded2() {
    setTimeout(refreshTimer, 1000);
    
}

function refreshTimer() {
    refreshBoard();
    poll();
    setTimeout(refreshTimer, 1000);
}