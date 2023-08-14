"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determinePos = void 0;
var RenderingConstants_js_1 = require("./RenderingConstants.js");
function determinePos(graph, canvasSpecs, renderingType) {
    var xCenter = canvasSpecs.width / 2;
    var yCenter = canvasSpecs.height / 2;
    var dim = (xCenter > yCenter) ? yCenter : xCenter;
    var radius = Math.round(dim * 0.75);
    switch (renderingType) {
        case RenderingConstants_js_1.CIRCULAR_GRAPH_RENDERING:
            return circularAnglePositions(graph.size(), { xCenter: xCenter, yCenter: yCenter }, radius);
        case RenderingConstants_js_1.CONCENTRIC_GRAPH_RENDERING:
            return concentricPositions(graph, { xCenter: xCenter, yCenter: yCenter }, radius);
        case RenderingConstants_js_1.RANDOM_GRAPH_RENDERING:
            return randomPositions(graph, { xCenter: xCenter, yCenter: yCenter }, radius);
    }
}
exports.determinePos = determinePos;
function circularAnglePositions(n, centerPos, radius) {
    var positions = [];
    var angle = 2 * Math.PI / n;
    var currentAngle = 0;
    for (var i = 0; i < n; i++) {
        var x = centerPos.xCenter - Math.round(radius * Math.sin(currentAngle));
        var y = centerPos.yCenter - Math.round(radius * Math.cos(currentAngle));
        //console.log( i + " [x,y] = " + x + "," + y);
        currentAngle += angle;
        positions.push({ x: x, y: y });
    }
    return positions;
}
function concentricPositions(graph, centerPos, radius) {
    var n = graph.size();
    var positions = [];
    var finalPositions = new Array(n);
    //If there are to few  nodes (Like 4 or less), there is no point to use concentric circle for the rendering, and simple circle rendering will be ok...
    if (n <= 4)
        return circularAnglePositions(n, centerPos, radius);
    radius = 60;
    var nodeListByEdgeCount = getEdgeCountByNode(graph);
    console.log("Display Nodes by edges count:");
    var _loop_1 = function (edgeCount) {
        console.log("key ".concat(edgeCount, " --> ").concat(nodeListByEdgeCount.get(edgeCount)));
        var nodeList = nodeListByEdgeCount.get(edgeCount);
        var positionsAtThisLevel = [];
        if (nodeList.length > 1)
            positionsAtThisLevel = circularAnglePositions(nodeList.length, centerPos, radius);
        else
            positionsAtThisLevel.push({ x: centerPos.xCenter, y: centerPos.yCenter });
        positions = positions.concat(positionsAtThisLevel);
        //Transfer the positions in the final postion array...
        nodeList.forEach(function (nodeIndex) {
            var nextPos = positionsAtThisLevel.pop();
            finalPositions[nodeIndex] = nextPos;
        });
        radius += 60;
    };
    for (var _i = 0, _a = nodeListByEdgeCount.keys(); _i < _a.length; _i++) {
        var edgeCount = _a[_i];
        _loop_1(edgeCount);
    }
    //positions =  randomPositions(graph , centerPos,radius);  
    // return positions;
    return finalPositions;
}
//   This method sorts the  node by edges count (most edge at the top) and returns a map where the key-value is the EdgeCount-NodeList
//   For instance, for the Nodes:
//        A (2 edges), B (3 edges), C (1 edge) and D (2 edges)
//        the node A & D will be grouped toghetter under the key '2'
//    Result:   3-[B], 2-[A,D], 1-[C]
//    Note: the keys of the map will be sorted in reversed order, as it will be more convenient for the rendering, as the nodes with the 
//          highest edges count has to be placed first (in the center), and we go with nodes with lower and lower edges count toward the outside
function getEdgeCountByNode(graph) {
    var nodeListByEdgeCount = new Map();
    var positions = [];
    var n = graph.size();
    // 1 - Group the nodes by their edges connected to them... The map object 'nodeListByEdgeCount' should end up with a key-pair of 'edgeCount'-'List Of index of nodes'
    for (var i = 0; i < n; i++) {
        var edges = graph.getEdgesForNode(i);
        var edgeCount = edges.length;
        var nodeList = nodeListByEdgeCount.get(edgeCount);
        if (nodeList === undefined) {
            nodeList = [i];
        }
        else {
            nodeList.push(i);
        }
        nodeListByEdgeCount.set(edgeCount, nodeList);
    }
    // 2 - Get the index in the node-map-by-edge (nodeListByEdgeCount) in reverse order. The nodes at the beginning (with most edge connection) will be first, and placed in the center and we are going outward, with the nodes with less and less edge connections...
    var nodeIndexes = [];
    for (var _i = 0, _a = nodeListByEdgeCount.keys(); _i < _a.length; _i++) {
        var x = _a[_i];
        nodeIndexes.push(x);
    }
    nodeIndexes.sort(function (a, b) { return b - a; });
    // Will return the result in another map, but this time, with the keys correctly inserted in reverse order...
    var resultMap = new Map();
    nodeIndexes.forEach(function (nodeIndex) {
        resultMap.set(nodeIndex, nodeListByEdgeCount.get(nodeIndex));
    });
    return resultMap;
}
function randomPositions(graph, centerPos, radius) {
    var n = graph.size();
    var positions = [];
    for (var i = 0; i < n; i++) {
        var x = centerPos.xCenter - Math.round(2 * radius * Math.random() - radius);
        var y = centerPos.yCenter - Math.round(2 * radius * Math.random() - radius);
        positions.push({ x: x, y: y });
    }
    return positions;
}
