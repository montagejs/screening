/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

/*
 * This file will be executed on a webdriver client to allow it to visualize mouse and touch input
 * Since it is run client-side, no requires or external scripts may be used.
 */

var visCss = [
    ".screening-visualization-layer {",
    "    position: fixed;",
    "    top: 0;",
    "    bottom: 0;",
    "    left: 0;",
    "    right: 0;",
    "    z-index: 2147483647;", // Max positive signed int
    "    pointer-events: none;",
    "}",

    ".screening-visualization-layer .screening-input-vis {",
    "    position: absolute;",
    "    background-color: rgba(145, 177, 220, 0.5);",
    "    border: 2px solid rgba(73, 117, 166, 0.75);",
    "    border-radius: 24px;",
    "    width: 42px;",
    "    height: 42px;",
    "    margin: -21px 0 0 -21px;",
    "}",
    
    ".screening-visualization-layer .screening-input-vis.touch {",
    "    opacity: 0.0;",
    "    -webkit-transform: scale(1.5);",
    "    -webkit-transition-property: opacity, -webkit-transform;",
    "    -webkit-transition-duration: 0.5s, 0.5s;",
    "}",
    
    ".screening-visualization-layer .screening-input-vis.mouse {",
    "    opacity: 0.5;",
    "    -webkit-transform: scale(0.5);",
    "    -webkit-transition-property: opacity, -webkit-transform;",
    "    -webkit-transition-duration: 0.5s, 0.5s;",
    "}",
    
    ".screening-visualization-layer .screening-input-vis.active {",
    "    opacity: 1.0;",
    "    -webkit-transform: scale(1.0);",
    "    -webkit-transition-property: opacity, -webkit-transform;",
    "    -webkit-transition-duration: 0.2s, 0.2s;",
    "}",
].join("\n");

var visStyle = document.createElement('style');
visStyle.innerHTML = visCss;
document.head.appendChild(visStyle);

var visLayer = document.createElement('div');
visLayer.classList.add("screening-visualization-layer");
document.body.appendChild(visLayer);

function getTouchElement(touch) {
    var id = "screening-touch-vis-id_" + touch.identifier;
    var touchDiv = document.getElementById(id);
    if(!touchDiv) {
        touchDiv = document.createElement("div");
        touchDiv["id"] = id;
        touchDiv.classList.add("screening-input-vis");
        mouseDiv.classList.add("touch");
        visLayer.appendChild(touchDiv);
    }
    touchDiv.style.left = touch.pageX + "px";
    touchDiv.style.top = touch.pageY + "px";
    return touchDiv;
};

function getMouseElement(event) {
    var id = "screening-mouse-vis-id";
    var mouseDiv = document.getElementById(id);
    if(!mouseDiv) {
        mouseDiv = document.createElement("div");
        mouseDiv["id"] = id;
        mouseDiv.classList.add("screening-input-vis");
        mouseDiv.classList.add("mouse");
        visLayer.appendChild(mouseDiv);
    }
    mouseDiv.style.left = event.pageX + "px";
    mouseDiv.style.top = event.pageY + "px";
    return mouseDiv;
};

// Visualize mouse input
document.addEventListener("mousedown", function(event) {
    var mouseDiv = getMouseElement(event);
    mouseDiv.classList.add("active");
}, true);
document.addEventListener("mousemove", function(event) {
    var mouseDiv = getMouseElement(event);
}, true);
document.addEventListener("mouseup", function(event) {
    var mouseDiv = getMouseElement(event);
    mouseDiv.classList.remove("active");
}, true);

// Visualize touch input
document.addEventListener("touchstart", function(event) {
    var touchCount = event.changedTouches.length;
    for(var i = 0; i < touchCount; ++i) {
        var touch = event.changedTouches[i];
        var touchDiv = getTouchElement(touch);
        touchDiv.classList.add("active");
    }
}, true);
document.addEventListener("touchmove", function(event) {
    var touchCount = event.changedTouches.length;
    for(var i = 0; i < touchCount; ++i) {
        var touch = event.changedTouches[i];
        var touchDiv = getTouchElement(touch);
    }
}, true);
document.addEventListener("touchend", function(event) {
    var touchCount = event.changedTouches.length;
    for(var i = 0; i < touchCount; ++i) {
        var touch = event.changedTouches[i];
        var touchDiv = getTouchElement(touch);
        touchDiv.classList.remove("active");
    }
}, true);