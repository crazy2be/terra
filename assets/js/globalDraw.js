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

var ourSelectedColor = 'rgba(0, 0, 255, 0.75)'; var ourSelectedColorAlpha = 'rgba(0, 0, 255, 0)';
var enemySelectedColor = 'rgba(255, 0, 0, 0.75)'; var enemySelectedColorAlpha = 'rgba(255, 0, 0, 0)';

var dialogColorOne = 'rgba(0, 255, 255, 0.7)'; var dialogColorTwo = 'rgba(0, 205, 255, 0)';

function drawCircle(centerX, centerY, inRadius, outRadius, insideColor, outsideColor) {
    var radial = $("canvas").gradient({
        x1: centerX,
        y1: centerY,
        x2: centerX,
        y2: centerY,
        r1: inRadius, r2: outRadius,
        c1: insideColor,
        c2: outsideColor
    });
    $("canvas").drawArc({
        fillStyle: radial,
        x: centerX, y: centerY,
        radius: outRadius
    });
}

function drawStandardFadeoutCircle(centerX, centerY, radius, color, colorAlpha) {    
    var radial = $("canvas").gradient({
        x1: centerX,
        y1: centerY,
        x2: centerX,
        y2: centerY,
        r1: (radius / 3.0), r2: radius,
        c1: color,
        c2: colorAlpha
    });

    $("canvas").drawArc({
        fillStyle: radial,
        x: centerX, y: centerY,
        radius: radius
    });
}

function drawText(text, xPos, yPos) {
    $("canvas").drawText({
        fillStyle: "#9cf",
        strokeStyle: "#25a",
        strokeWidth: 4,
        x: xPos, y: yPos,
        font: "36pt Verdana, sans-serif",
        text: text
    });
}

function drawGradientBox(xPos, yPos, widthBox, heightBox, colorOne, colorTwo) {
    var linear = $("canvas").gradient({
        x1: xPos, y1: yPos,
        x2: xPos + widthBox, y2: yPos + heightBox,
        c1: colorOne,
        c2: colorOne        
    });

    var radial = $("canvas").gradient({
        x1: xPos,
        y1: yPos,
        x2: xPos,
        y2: yPos,
        r1: (widthBox / 3.0), r2: widthBox,
        c1: colorOne,
        c2: colorTwo
    });

    var linearTwo = $("canvas").gradient({
        x1: xPos, y1: yPos,
        x2: xPos + widthBox, y2: yPos + heightBox,
        c1: colorTwo,
        c2: colorTwo
    });

    $("canvas").drawRect({
        fillStyle: linear,
        x: xPos, y: yPos,
        width: widthBox,
        height: heightBox,
        fromCenter: false
    });

    $("canvas").drawRect({
        fillStyle: linear,
        x: xPos + 10, y: yPos + 10,
        width: widthBox - 20,
        height: heightBox - 20,
        fromCenter: false
    });
}