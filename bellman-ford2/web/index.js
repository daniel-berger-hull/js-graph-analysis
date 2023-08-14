"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = exports.init = void 0;
var GraphRender_js_1 = require("./view/GraphRender.js");
var GraphModel_js_1 = require("./model/GraphModel.js");
var RenderingConstants_js_1 = require("./view/RenderingConstants.js");
var MAX_NODE_NUMBER = 15;
var MAX_NODE_VALUE = 50;
var MAX_EDGE_NUMBER = 2;
var ERROR_MESSAGE_TIMEOUT = 3000;
var graphObject;
var renderingMode = RenderingConstants_js_1.CIRCULAR_GRAPH_RENDERING;
/////////////////////////////////////////////////////////////////////////////////
/*                      EVENT HANDLERS SECTION                                */
/////////////////////////////////////////////////////////////////////////////////
var setEventHandlers = function () {
    console.log("setEventHandlers");
    window.addEventListener("resize", windowResizeHandler);
    document.addEventListener('keydown', keydownHandler);
    var dfsButton = document.getElementById("dfs-button");
    dfsButton.addEventListener("click", dfsButtonClickHandler);
    var dfsAllPathButton = document.getElementById("dfs-all-path-button");
    dfsAllPathButton.addEventListener("click", dfsAllPathButtonClickHandler);
    //  const radioButtons = ["circular-rendering","concentric-rendering","random-rendering"];
    //  radioButtons.forEach( radioID => {
    //     const radioButton = document.getElementById(radioID);
    //     radioButton.addEventListener("click", renderingButtonClickHandler );
    //  });
};
var keydownHandler = function (event) {
    if (event.key === 'Escape') {
        hideWarningMessage();
    }
};
var windowResizeHandler = function () {
    var canvas = document.getElementById("graph-canvas");
    canvas.width = window.innerWidth - 60;
    (0, exports.render)();
};
var dfsButtonClickHandler = function () {
    var value = document.getElementById("NodeToWorkOn").value;
    if (isNaN(value)) {
        displayWarningMessage("Not numeric value entered!");
        return;
    }
    if ((value < 0) || (value > graph.size())) {
        displayWarningMessage("Invalid Node Index entered!");
        return;
    }
    graph.setSelectedNode(value);
    (0, exports.render)();
};
var dfsAllPathButtonClickHandler = function () {
    var nbrNodes = graph.size();
    console.log("Find path for all " + nbrNodes + "Nodes");
    for (var i = 0; i < nbrNodes; i++) {
        graph.setSelectedNode(i);
        var path = graph.DFS(i);
        console.log("".concat(i, " - ").concat(path));
        if (path.length === nbrNodes)
            console.log("%cComplete", 'color: #00ff00');
        else
            console.log("%cPartial ".concat(path.length), 'color: #ff0000');
    }
};
function initBellman() {
    var V = 5;
    var E = 8;
    graphObject = new GraphModel_js_1.GraphObject(V, E);
    graphObject.edge[0] = new GraphModel_js_1.Edge(0, 1, 1);
    graphObject.edge[1] = new GraphModel_js_1.Edge(0, 2, 4);
    graphObject.edge[2] = new GraphModel_js_1.Edge(1, 2, 3);
    graphObject.edge[3] = new GraphModel_js_1.Edge(1, 3, 2);
    graphObject.edge[4] = new GraphModel_js_1.Edge(1, 4, 2);
    graphObject.edge[5] = new GraphModel_js_1.Edge(3, 2, 5);
    graphObject.edge[6] = new GraphModel_js_1.Edge(3, 1, 1);
    graphObject.edge[7] = new GraphModel_js_1.Edge(4, 3, 3);
    // BellmanFord(graphObject, 0);
}
/////////////////////////////////////////////////////////////////////////////////
/*                        CORE METHODS  SECTION                                */
/////////////////////////////////////////////////////////////////////////////////
var init = function () {
    initBellman();
    setEventHandlers();
};
exports.init = init;
var render = function () {
    console.log("Render called...");
    var canvas = document.getElementById("graph-canvas");
    canvas.width = window.innerWidth - 60;
    (0, GraphModel_js_1.BellmanFord)(graphObject, 0);
    // Before
    // let renderObject = new GraphRender(canvas,graph,renderingMode);
    // renderObject.draw();
    // updateGraphDetailSection();
    var renderObject = new GraphRender_js_1.GraphRender(canvas, graphObject, renderingMode);
    renderObject.draw();
    //updateGraphDetailSection();
    console.log("Render called...");
};
exports.render = render;
/////////////////////////////////////////////////////////////////////////////////
/*                        UTILITY METHODS  SECTION                             */
/////////////////////////////////////////////////////////////////////////////////
var displayWarningMessage = function (msg) {
    var errorWarningSection = document.getElementById("warning-section");
    var errorWarningMsg = document.getElementById("error-warning-msg");
    errorWarningSection.style = "visibility: visible;";
    errorWarningMsg.innerHTML = msg;
    window.setTimeout(hideWarningMessage, ERROR_MESSAGE_TIMEOUT);
};
var hideWarningMessage = function () {
    var errorWarningSection = document.getElementById("warning-section");
    var errorWarningMsg = document.getElementById("error-warning-msg");
    errorWarningSection.style = "visibility: hidden;";
    errorWarningMsg.innerHTML = " ";
};
// The Graph Detail Section is at the bottom of the screen, under the Canvas
var updateGraphDetailSection = function () {
    var nbrNodes = graph.size();
    for (var i = 0; i < nbrNodes; i++) {
        var nodeValue = Math.round(Math.random() * MAX_NODE_VALUE) + 1;
        console.log(i + " value is " + " nodeValue, edges --> " + graph.getEdgesForNode(i));
    }
    document.getElementById("NodeTotalCount").innerHTML = nbrNodes;
};
var getRandomEdgeIndexes = function (currentIndex, nbrNodes) {
    var nbrEdges = Math.round(Math.random() * MAX_EDGE_NUMBER) + 1;
    var indexes = [];
    for (var j = 0; j < nbrEdges;) {
        var otherNodeIndex = Math.round(Math.random() * (nbrNodes - 1));
        if (!indexes.includes(otherNodeIndex) && otherNodeIndex !== currentIndex) {
            indexes.push(otherNodeIndex);
            j++;
        }
    }
    return indexes;
};
