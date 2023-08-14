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
var _Graph_instances, _Graph_nodeIndexesPath, _Graph_validateNodeIndex, _Graph_validateNodeValue;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = void 0;
var Graph = /** @class */ (function () {
    // Constructor
    function Graph(v) {
        _Graph_instances.add(this);
        _Graph_nodeIndexesPath.set(this, void 0);
        this.V = v;
        this.adj = new Array(v);
        this.values = new Array(v);
        for (var i = 0; i < v; i++)
            this.adj[i] = [];
        this.selectedNode = 0;
    }
    Graph.prototype.size = function () {
        return this.V;
    };
    Graph.prototype.getSelectedNode = function () { return this.selectedNode; };
    Graph.prototype.setSelectedNode = function (index) { this.selectedNode = (index >= 0 && index < this.V) ? index : 0; };
    // Function to add an edge into the graph
    Graph.prototype.addEdge = function (v, w) {
        // Add w to v's list.
        this.adj[v].push(w);
    };
    Graph.prototype.getEdgesForNode = function (v) {
        __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_validateNodeIndex).call(this, v, "getEdgesForNode");
        return this.adj[v];
    };
    Graph.prototype.getNodeValue = function (v) {
        __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_validateNodeIndex).call(this, v, "getNodeValue");
        return this.values[v];
    };
    Graph.prototype.setNodeValue = function (v, val) {
        __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_validateNodeIndex).call(this, v, "setNodeValue");
        __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_validateNodeValue).call(this, val, "setNodeValue");
        this.values[v] = val;
    };
    // A function used by DFS
    Graph.prototype.DFSUtil = function (v, visited) {
        // Mark the current node as visited and print it
        visited[v] = true;
        // console.log(v + " ");
        __classPrivateFieldGet(this, _Graph_nodeIndexesPath, "f").push(v);
        // Recur for all the vertices adjacent to this
        // vertex
        for (var _i = 0, _a = this.adj[v].values(); _i < _a.length; _i++) {
            var i = _a[_i];
            var n = i;
            if (!visited[n])
                this.DFSUtil(n, visited);
        }
    };
    // The function to do DFS traversal.
    // It uses recursive
    // DFSUtil()
    Graph.prototype.DFS = function (v) {
        __classPrivateFieldSet(this, _Graph_nodeIndexesPath, [], "f");
        // Mark all the vertices as
        // not visited(set as
        // false by default in java)
        var visited = new Array(this.V);
        for (var i = 0; i < this.V; i++)
            visited[i] = false;
        // Call the recursive helper
        // function to print DFS
        // traversal
        this.DFSUtil(v, visited);
        // console.log("DFS search Result, staring node index " + this.getSelectedNode());
        console.log(__classPrivateFieldGet(this, _Graph_nodeIndexesPath, "f"));
        return __classPrivateFieldGet(this, _Graph_nodeIndexesPath, "f");
    };
    Graph.prototype.toString = function () {
        console.log("Graph toString()");
    };
    return Graph;
}());
exports.Graph = Graph;
_Graph_nodeIndexesPath = new WeakMap(), _Graph_instances = new WeakSet(), _Graph_validateNodeIndex = function _Graph_validateNodeIndex(i, methodName) {
    if ((i < 0) || (i > this.adj.length))
        throw "Invalid Node passed to method " + methodName + " (v is " + i + " and the graph has a maximum of " + this.adj.length + ")";
}, _Graph_validateNodeValue = function _Graph_validateNodeValue(val, methodName) {
    if (val < 0)
        throw "Invalid Node value passed to method " + methodName + " (value is " + val + ")";
};
