"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _GraphRender_instances, _GraphRender_canvas, _GraphRender_graphObject, _GraphRender_renderingMode, _GraphRender_validateParams, _GraphRender_init, _GraphRender_isValidRenderingMode;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphRender = void 0;
// import { Graph }      from '../model/Graph.js';
var NodeSpaceLocator_js_1 = require("./NodeSpaceLocator.js");
var RenderingConstants_js_1 = require("./RenderingConstants.js");
// This class should only draw on the Canvas, and the calculations required, like the locations of the node shouhld be delegated to some other classes or functions...
// The reason is that the way we spread the nodes on a the screen can be done in many differents ways, but things like draw a node or segment alway stay the same and should be done in this class only
var GraphRender = /** @class */ (function () {
    function GraphRender(targetCanvas, graph, renderingMode) {
        _GraphRender_instances.add(this);
        _GraphRender_canvas.set(this, void 0);
        _GraphRender_graphObject.set(this, void 0);
        _GraphRender_renderingMode.set(this, void 0);
        __classPrivateFieldGet(this, _GraphRender_instances, "m", _GraphRender_validateParams).call(this, targetCanvas, graph);
        __classPrivateFieldSet(this, _GraphRender_canvas, targetCanvas, "f");
        __classPrivateFieldSet(this, _GraphRender_graphObject, graph, "f");
        __classPrivateFieldSet(this, _GraphRender_renderingMode, renderingMode, "f");
        __classPrivateFieldGet(this, _GraphRender_instances, "m", _GraphRender_init).call(this);
    }
    GraphRender.prototype.getCanvas = function () { return __classPrivateFieldGet(this, _GraphRender_canvas, "f"); };
    ;
    GraphRender.prototype.getGraph = function () { return __classPrivateFieldGet(this, _GraphRender_graphObject, "f"); };
    ;
    GraphRender.prototype.getRenderingMode = function () { return __classPrivateFieldGet(this, _GraphRender_renderingMode, "f"); };
    ;
    GraphRender.prototype.setCanvas = function (canvas) { __classPrivateFieldSet(this, _GraphRender_canvas, canvas, "f"); };
    GraphRender.prototype.setGraph = function (graph) { __classPrivateFieldSet(this, _GraphRender_graphObject, graph, "f"); };
    ;
    GraphRender.prototype.setRenderingMode = function (mode) { __classPrivateFieldGet(this, _GraphRender_renderingMode, "f"); };
    ;
    GraphRender.prototype.renderNode = function (context, position, size, value, isLeaf) {
        context.strokeStyle = "#FBED20";
        context.beginPath();
        context.arc(position.x, position.y, size, 0, 2 * Math.PI);
        context.fillStyle = (isLeaf === true) ? 'blue' : 'white';
        context.fill();
        context.lineWidth = 2;
        context.stroke();
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "12px Arial";
        var label = value;
        context.fillStyle = "black";
        context.fillText(label, position.x + 1, position.y + 1);
        context.fillStyle = (isLeaf === true) ? 'white' : "#0046BE";
        context.fillText(label, position.x, position.y);
    };
    GraphRender.prototype.renderSegment = function (context, startPos, endPos, color) {
        context.beginPath();
        context.moveTo(startPos.x, startPos.y);
        context.lineTo(endPos.x, endPos.y);
        context.strokeStyle = color;
        context.lineWidth = 1;
        context.stroke();
    };
    GraphRender.prototype.renderLoopSegment = function (context, position, size, color) {
        context.beginPath();
        context.arc(position.x, position.y - (size * 1.3), size, 0, 2 * Math.PI);
        context.lineWidth = 1;
        context.stroke();
    };
    GraphRender.prototype.getCanvasSpecs = function () {
        return { width: __classPrivateFieldGet(this, _GraphRender_canvas, "f").width,
            height: __classPrivateFieldGet(this, _GraphRender_canvas, "f").height };
    };
    GraphRender.prototype.drawSegments = function (ctx, graph, nodePosArray) {
        var _this = this;
        console.log("%c drawSegments", "color: red");
        var _loop_1 = function (i) {
            var startNodePos = { x: nodePosArray[i].x,
                y: nodePosArray[i].y };
            var edges = graph.getEdgesForNode(i);
            edges.forEach(function (nextEdge) {
                if (nextEdge.dest !== nextEdge.src) {
                    // console.log(i + " to " + index);
                    var endNodePos = { x: nodePosArray[nextEdge.dest].x, y: nodePosArray[nextEdge.dest].y };
                    _this.renderSegment(ctx, startNodePos, endNodePos, "#00FF00");
                }
                else {
                    console.log("Render: an edge on the same node detected!");
                    _this.renderLoopSegment(ctx, startNodePos, 10, "#00FF00");
                }
            });
        };
        for (var i = 0; i < graph.size(); i++) {
            _loop_1(i);
        }
    };
    GraphRender.prototype.drawPath = function (ctx, graph, nodePosArray) {
        var seletectedNodeIndex = graph.getSelectedNode();
        var path = graph.DFS(seletectedNodeIndex);
        console.log("Display path from node :" + seletectedNodeIndex);
        var startIndex = path[0];
        var startNodePos = { x: nodePosArray[startIndex].x,
            y: nodePosArray[startIndex].y };
        for (var i = 1; i < path.length; i++) {
            var endIndex = path[i];
            var endNodePos = { x: nodePosArray[endIndex].x,
                y: nodePosArray[endIndex].y };
            this.renderSegment(ctx, startNodePos, endNodePos, "#FF0000");
            startNodePos = endNodePos;
        }
    };
    GraphRender.prototype.drawNodes = function (ctx, nodePosArray) {
        var _this = this;
        // Draw the node on top of the segments...
        nodePosArray.forEach(function (pos, index) {
            _this.renderNode(ctx, pos, 10, index, true);
        });
    };
    GraphRender.prototype.draw = function () {
        var ctx = __classPrivateFieldGet(this, _GraphRender_canvas, "f").getContext("2d");
        var graph = __classPrivateFieldGet(this, _GraphRender_graphObject, "f");
        var nodePositions = (0, NodeSpaceLocator_js_1.determinePos)(graph, this.getCanvasSpecs(), this.getRenderingMode());
        this.drawSegments(ctx, graph, nodePositions);
        //this.drawPath(ctx, graph, nodePositions);
        this.drawNodes(ctx, nodePositions);
    };
    return GraphRender;
}());
exports.GraphRender = GraphRender;
_GraphRender_canvas = new WeakMap(), _GraphRender_graphObject = new WeakMap(), _GraphRender_renderingMode = new WeakMap(), _GraphRender_instances = new WeakSet(), _GraphRender_validateParams = function _GraphRender_validateParams(targetCanvas, graph) {
    if (targetCanvas === null || typeof targetCanvas === "undefined")
        throw "You MUST provide a valid Canvas object to the GraphRender class!";
    if (graph === null || typeof graph === "undefined")
        throw "You MUST provide a valid Graph object GraphRender class!";
}, _GraphRender_init = function _GraphRender_init() {
    //Note the init may be removed later if no usage is done...
}, _GraphRender_isValidRenderingMode = function _GraphRender_isValidRenderingMode(mode) {
    if (mode < RenderingConstants_js_1.CIRCULAR_GRAPH_RENDERING || mode > RenderingConstants_js_1.RANDOM_GRAPH_RENDERING)
        return false;
    else
        return true;
};
