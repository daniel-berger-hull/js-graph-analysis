"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GraphObject_instances, _GraphObject_validateNodeIndex, _GraphObject_validateNodeValue;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BellmanFord = exports.GraphObject = exports.Edge = void 0;
// a structure to represent a connected, directed and
// weighted graph
var Edge = /** @class */ (function () {
    function Edge(src, dest, weight) {
        this.src = src;
        this.dest = dest;
        this.weight = weight;
    }
    return Edge;
}());
exports.Edge = Edge;
var GraphObject = /** @class */ (function () {
    function GraphObject(nbrVertex, nbrEdges) {
        _GraphObject_instances.add(this);
        this.nbrVertex = nbrVertex;
        this.nbrEdges = nbrEdges;
        this.edge = [];
        this.init(nbrVertex, nbrEdges);
    }
    GraphObject.prototype.init = function (nbrVertex, nbrEdges) {
        //const graph = new Graph(V, E);
        for (var i = 0; i < nbrEdges; i++) {
            this.edge[i] = new Edge();
        }
        return this;
    };
    GraphObject.prototype.size = function () {
        return this.nbrVertex;
    };
    GraphObject.prototype.getEdgesForNode = function (v) {
        __classPrivateFieldGet(this, _GraphObject_instances, "m", _GraphObject_validateNodeIndex).call(this, v, "getEdgesForNode");
        var results = [];
        this.edge.forEach(function (nextEdge) {
            if (nextEdge.src === v) {
                results.push(nextEdge);
            }
            //console.log(nextEdge);
        });
        return results;
        //return this.adj[v];
    };
    GraphObject.prototype.printArr = function (dist) {
        console.log("Vertex Distance from Source");
        for (var i = 0; i < this.nbrVertex; i++) {
            console.log("".concat(i, " \t\t ").concat(dist[i]));
        }
    };
    return GraphObject;
}());
exports.GraphObject = GraphObject;
_GraphObject_instances = new WeakSet(), _GraphObject_validateNodeIndex = function _GraphObject_validateNodeIndex(i, methodName) {
    //        if (  (i < 0) || (i > this.adj.length))  
    if ((i < 0) || (i > this.nbrVertex))
        throw "Invalid Node passed to method " + methodName + " (v is " + i + " and the graph has a maximum of " + this.nbrVertex + ")";
}, _GraphObject_validateNodeValue = function _GraphObject_validateNodeValue(val, methodName) {
    if (val < 0)
        throw "Invalid Node value passed to method " + methodName + " (value is " + val + ")";
};
function BellmanFord(graph, src) {
    var V = graph.nbrVertex;
    var E = graph.nbrEdges;
    var dist = [];
    for (var i = 0; i < V; i++) {
        dist[i] = Number.MAX_SAFE_INTEGER;
    }
    dist[src] = 0;
    for (var i = 1; i <= V - 1; i++) {
        for (var j = 0; j < E; j++) {
            var u = graph.edge[j].src;
            var v = graph.edge[j].dest;
            var weight = graph.edge[j].weight;
            if (dist[u] !== Number.MAX_SAFE_INTEGER && dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
            }
        }
    }
    for (var i = 0; i < E; i++) {
        var u = graph.edge[i].src;
        var v = graph.edge[i].dest;
        var weight = graph.edge[i].weight;
        if (dist[u] !== Number.MAX_SAFE_INTEGER && dist[u] + weight < dist[v]) {
            console.log("Graph contains negative weight cycle");
            return;
        }
    }
    graph.printArr(dist);
}
exports.BellmanFord = BellmanFord;
