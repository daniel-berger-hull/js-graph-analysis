"use strict";



export const INF = 2147483647;

export const DEFAULT_NODE_VALUE   = 9999;
export const DEFAULT_EDGE_WEIGHT  = 1;


const NO_EDGES_DEFINED = 0;

// a structure to represent a connected, directed and weighted graph
export class Edge {
    
    src;
    dest;
    weight;

    //Nov 3:  move the src, dest and weight as variable of the Edge class;
    constructor(src, dest, weight) {
        this.src = src;
        this.dest = dest;
        this.weight = weight;
    }
}
    
export class GraphObject {

    #nodeIndexesPath;
    #nbrNodes;
    #nbrEdges;   // Nov 3: This value appears to be not required, as the getNbrEdges exists for this...


    constructor(nbrNodes) {

        this.#nbrNodes = nbrNodes;
        this.#nbrEdges = NO_EDGES_DEFINED;
        
        this.edges = [];

        // Nov 3 Added to align with the older Graph.js --> Each node had no values in GraphObject
        this.values = new Array(nbrNodes);
        this.selectedNode = 0;
    }

    size() {
        return this.#nbrNodes;
    }

    getNbrNodes()             {  return this.#nbrNodes;  }
    getNbrEdges()             {  return this.edges.length;  }


    getSelectedNode()         {   return this.selectedNode; }
    setSelectedNode(index)    {   this.selectedNode = ( index>=0 && index < this.getNbrNodes()) ? index : 0; }

    getEdgesForNode(v) {

        this.#validateNodeIndex(v, "getEdgesForNode");

        const results = [];


        this.edges.forEach(nextEdge => {

            if (nextEdge.src === v) {
                results.push(nextEdge);
            }
        });

        return results;
    }

    addNode() {
        this.#nbrNodes++;
        this.values.push(DEFAULT_NODE_VALUE);

        return this.values.length;
    }


    addEdge(fromNode, toNode ) {
        this.addEdge(fromNode, toNode, DEFAULT_EDGE_WEIGHT);
    }


      // Function to add an edge into the graph
      addEdge(fromNode, toNode, weight)
      {
  
          this.#validateNodeIndex(fromNode, "addEdge");
          this.#validateNodeIndex(toNode, "addEdge");
          this.#validateEdgeWeight(weight, "addEdge");

          
          this.edges.push(new Edge(fromNode, toNode, weight));
                  
    }

    getNodeValue(v) {

        this.#validateNodeIndex(v, "getNodeValue");

        return this.values[v];
    }

    setNodeValue(v,val) {

        this.#validateNodeIndex(v, "setNodeValue");
        this.#validateNodeValue(val, "setNodeValue");

        this.values[v] = val;
    }


    #validateNodeIndex(i, methodName) {

        if (  (i < 0) || (i > this.getNbrNodes()))  
            throw "Invalid Node passed to method " + methodName + " (v is " + i + " and the graph has a maximum of " + this.getNbrNodes() + ")";
    }

    #validateNodeValue(val, methodName) {

        if (val < 0)  
            throw "Invalid Node value passed to method " + methodName + " (value is " + val + ")" ;
    }

    #validateEdgeWeight(weight,methodName) {

        if (weight < 0)  
            throw "Invalid weight value passed to method " + methodName + " (value is " + weight + ")" ;
    }

    printArr(dist) {
        console.log("Vertex Distance from Source");
        for (let i = 0; i < this.getNbrNodes(); i++) {

             console.log(`${i} \t\t ${dist[i]}`);
         }
     }



////////////////////////////////////////////////////////////////////////////////////////////////////////
// Nov 3: The DFS functions and the BellmanFord function bellow should be moved into the own class...
     
  recursiveLevel = 0; 

// A function used by DFS
DFSUtil(v, visited)
{

    this.recursiveLevel++;
     
    // Mark the current node as visited and print it
    visited[v] = true;

    this.#nodeIndexesPath.push(v);



    // DFS deals with index of node connected, so the code below extra the index for the edges connected to be current node v
    const edgesForThisNode = this.getEdgesForNode(v);    // Returns An array of class Edges
    const connectedNodes = [];

    edgesForThisNode.forEach(nextEdge => {  connectedNodes.push(nextEdge.dest);   }  );


    // Nov 3: This is for debug. As today, the DFS result is a bit odd... As it gives [0, 1, 2, 3, 4, 6].
    //        But there no edges between 2 and 3!!!
    //console.log(`DFSUtil Level: ${this.recursiveLevel}, Start Node: ${v}, Connected Nodes ${connectedNodes}, Index Path: ${this.#nodeIndexesPath} , Visited Array: ${visited}`);

    for(let i of connectedNodes) {
        let n = i
        if (!visited[n])
            this.DFSUtil(n, visited);
    }

    this.recursiveLevel--;
}
 
// The function to do DFS traversal.
// It uses the recursive DFSUtil() method
DFS(v)
{
     this.#nodeIndexesPath = [];
    const nbrNodes = this.getNbrNodes();
    // Mark all the vertices as not visited(set as false by default in javascript)
    let visited = new Array(nbrNodes);
    for(let i = 0; i < nbrNodes; i++)
        visited[i] = false;

    // Call the recursive helper
    // function to print DFS
    // traversal
    this.DFSUtil(v, visited);

    // console.log("DFS search Result, staring node index " + this.getSelectedNode());
    console.log(this.#nodeIndexesPath);

    return this.#nodeIndexesPath;
}
}
    


   