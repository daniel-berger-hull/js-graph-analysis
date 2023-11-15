
"use strict";
// import { Graph }      from './model/Graph.js';
//import { BellmanFord, GraphObject, Edge, shortestPath }  from './model/GraphModel.js';
import { GraphObject, Edge }  from './model/GraphModel.js';

import { BellmanFord, shortestPath }  from './model/PathFind.js';


import { GraphRender}   from './view/GraphRender.js';

import { CIRCULAR_GRAPH_RENDERING  , CONCENTRIC_GRAPH_RENDERING  ,RANDOM_GRAPH_RENDERING  } from './view/RenderingConstants.js';
 


const MAX_NODE_NUMBER = 15;
const MAX_NODE_VALUE  = 50;
const MAX_EDGE_NUMBER  = 2;

const ERROR_MESSAGE_TIMEOUT = 3000;


// let graph;
let graphObject;
let graphObject2;


let renderingMode = CIRCULAR_GRAPH_RENDERING;



/////////////////////////////////////////////////////////////////////////////////
/*                      EVENT HANDLERS SECTION                                */
/////////////////////////////////////////////////////////////////////////////////


const setEventHandlers  = () => {
    console.log("setEventHandlers");

     window.addEventListener("resize", windowResizeHandler );
     document.addEventListener('keydown', keydownHandler );


     const dfsButton = document.getElementById("dfs-button");
     dfsButton.addEventListener("click", dfsButtonClickHandler );

     const dfsAllPathButton = document.getElementById("dfs-all-path-button");
     dfsAllPathButton.addEventListener("click", dfsAllPathButtonClickHandler );


     const disjkstrasButton = document.getElementById("disjkstras-button");
     disjkstrasButton.addEventListener("click", disjkstrasButtonClickHandler );
     
     const radioButtons = ["circular-rendering","concentric-rendering","random-rendering"];


     radioButtons.forEach( radioID => {

        const radioButton = document.getElementById(radioID);
        radioButton.addEventListener("click", renderingButtonClickHandler );
     });
     

}

const  keydownHandler = (event)  => {
        
    if ( event.key === 'Escape') {
     
        hideWarningMessage();
    }
}


const windowResizeHandler = () => {

    const canvas = document.getElementById("graph-canvas");
    canvas.width = window.innerWidth - 60;

    render();        
}



const dfsButtonClickHandler  = () => {

    const textBox = document.getElementById("NodeToWorkOn");
    const value = document.getElementById("NodeToWorkOn").value;

    if( isNaN(value) )   {
        displayWarningMessage("Not numeric value entered!",textBox);
        return;
    }
    

    if ( (value < 0) || (value > graphObject.size()) ) {

      displayWarningMessage("Invalid Node Index entered!",textBox);
      return;
    }
    
    graphObject.setSelectedNode(value);

    render();
}

const dfsAllPathButtonClickHandler  = () => {

    const nbrNodes = graphObject.size();

    console.log("Find path for all " + nbrNodes + "Nodes");

    for (let i=0;i<nbrNodes;i++) {

        graphObject.setSelectedNode(i);
        const path = graphObject.DFS(i);
        console.log(`${i} - ${path}`);

        if (path.length === nbrNodes) 
            console.log("%cComplete",'color: #00ff00');
        else
            console.log(`%cPartial ${path.length}`,'color: #ff0000');

    }
}


const disjkstrasButtonClickHandler  = () => {


    const startNode = document.getElementById("DisjkstrasStartNode");
    const endNode  = document.getElementById("DisjkstrasEndNode");

    const startNodeIndex =  parseInt(startNode.value);
    const endNodeIndex =  parseInt(endNode.value);
      
    if( isNaN(startNodeIndex) )   {
        displayWarningMessage("Not numeric value entered for start Node!",startNode);
        return;
    }
    if( isNaN(endNodeIndex) )   {
        displayWarningMessage("Not numeric value entered for end Node!",endNode);
        return;
    }

    
      if ( (startNodeIndex < 0) || (startNodeIndex >= graphObject.getNbrNodes()) ) {

        displayWarningMessage("Invalid Start Node Index entered!",startNode);
        return;
      }

      if ( (endNodeIndex < 0) || (endNodeIndex >= graphObject.getNbrNodes()) ) {

        displayWarningMessage("Invalid End Node Index entered!",endNode);
        return;
      }
    
      const dist =  shortestPath(graphObject,startNodeIndex);

      console.log(`Dijkstra: Start/End Node [${startNodeIndex},${endNodeIndex}] , cost = ${dist[endNodeIndex]}`) ;

      console.log("Distances from Node 0 to node#");
      for (let i = 0; i < dist.length; ++i)
        console.log(i + " --> " + dist[i]);


      render();
}



const renderingButtonClickHandler = (event) => {


    if ( event.currentTarget.id === "circular-rendering") {
        console.log("Click circular-rendering");
        renderingMode = CIRCULAR_GRAPH_RENDERING;
    } else if ( event.currentTarget.id === "concentric-rendering") {
        console.log("Click concentric-rendering");
        renderingMode = CONCENTRIC_GRAPH_RENDERING;
    } else if ( event.currentTarget.id === "random-rendering") {
        console.log("Click random-rendering");
        renderingMode = RANDOM_GRAPH_RENDERING;
    } 

    render();
}




/////////////////////////////////////////////////////////////////////////////////
/*                        CORE METHODS  SECTION                                */
/////////////////////////////////////////////////////////////////////////////////

export const init = () => {

    const nbrNodes = 8;
    
    setEventHandlers();

    // initBellman(nbrNodes);
    initDijkstra(9);

    // By default, the rendering mode is circular
    document.getElementById('circular-rendering').checked = true;
}

function initBellman (nbrNodes) {

    const V = 7;
    const E = nbrNodes;
    graphObject = new GraphObject(V);
    


    graphObject.addEdge(0, 1, 1);
    graphObject.addEdge(0, 2, 4);
    graphObject.addEdge(1, 2, 3);
    graphObject.addEdge(1, 3, 2);
    graphObject.addEdge(1, 4, 2);
    graphObject.addEdge(3, 2, 5);
    graphObject.addEdge(3, 1, 1);
    graphObject.addEdge(4, 3, 3);
    graphObject.addEdge(4, 6, 3);
    graphObject.addEdge(5, 2, 2);


    for (let i=0;i<graphObject.getNbrNodes();i++) {
        graphObject.setNodeValue(i,i*10);
    }
    
    

    console.log(`initBellman:\nNode Count ${graphObject.getNbrNodes()} \nEdge number is  ${graphObject.getNbrEdges()}`);
    // console.log("Nodes Values:")
    // for (let i=0;i<graphObject.getNbrNodes();i++) {
    //     console.log(`${i}  -> ${graphObject.getNodeValue(i)}`)
    // }
}

function initDijkstra(nbrNodes) {
   
    
    // const V = 7;
    // const E = 9;
    graphObject2 = new GraphObject(nbrNodes);
    

    graphObject2.addEdge(0, 1, 4);
    graphObject2.addEdge(0, 7, 8);
    graphObject2.addEdge(1, 2, 8);
    graphObject2.addEdge(1, 7, 11);
    graphObject2.addEdge(2, 3, 7);
    graphObject2.addEdge(2, 8, 2);
    graphObject2.addEdge(2, 5, 4);
    graphObject2.addEdge(3, 4, 9);
    graphObject2.addEdge(3, 5, 14);
    graphObject2.addEdge(4, 5, 10);
    graphObject2.addEdge(5, 6, 2);
    graphObject2.addEdge(6, 7, 1);
    graphObject2.addEdge(6, 8, 6);
    graphObject2.addEdge(7, 8, 7);

    graphObject2.addEdge(1, 0, 4);
    graphObject2.addEdge(7, 0, 8);
    graphObject2.addEdge(2, 1, 8);
    graphObject2.addEdge(7, 1, 11);
    graphObject2.addEdge(3, 2, 7);
    graphObject2.addEdge(8, 2, 2);
    graphObject2.addEdge(5, 2, 4);
    graphObject2.addEdge(4, 3, 9);
    graphObject2.addEdge(5, 3, 14);
    graphObject2.addEdge(5, 4, 10);
    graphObject2.addEdge(6, 5, 2);
    graphObject2.addEdge(7, 6, 1);
    graphObject2.addEdge(8, 6, 6);
    graphObject2.addEdge(8, 7, 7);

    shortestPath(graphObject2,0);

    graphObject = graphObject2;
}



export const render = () => {

    console.log("Render called...");
    var canvas = document.getElementById("graph-canvas");
    canvas.width = window.innerWidth - 60;

    let renderObject = new GraphRender(canvas,graphObject,renderingMode);
    renderObject.draw();

    updateGraphDetailSection();
    console.log("Render called...");
   
}



/////////////////////////////////////////////////////////////////////////////////
/*                        UTILITY METHODS  SECTION                             */
/////////////////////////////////////////////////////////////////////////////////

let errorOnControl;

const displayWarningMessage = (msg,textBox) => {


    const errorWarningSection  = document.getElementById("warning-section");
    const errorWarningMsg  = document.getElementById("error-warning-msg");


    errorWarningSection.style = "visibility: visible;"
    errorWarningMsg.innerHTML = msg;

    window.setTimeout(hideWarningMessage, ERROR_MESSAGE_TIMEOUT );

    errorOnControl= textBox;
    errorOnControl.style = "background-color: #ff8080;"

} 

const hideWarningMessage= () => {

    const errorWarningSection  = document.getElementById("warning-section");
    const errorWarningMsg  = document.getElementById("error-warning-msg");

    errorWarningSection.style = "visibility: hidden;"
    errorWarningMsg.innerHTML = " "
   
    errorOnControl.style = "background-color: white"

}




// The Graph Detail Section is at the bottom of the screen, under the Canvas
const updateGraphDetailSection  = () => {
    
    const nbrNodes =  graphObject.getNbrNodes();
    const nbrEdges =  graphObject.getNbrEdges();


    for (let i=0;i<nbrNodes;i++) {

        const nodeValue = Math.round( Math.random() * MAX_NODE_VALUE ) + 1;    

        const edgesForThisNode = graphObject.getEdgesForNode(i);    // An array of class Edges
        const connectedNodes = [];

        edgesForThisNode.forEach(nextEdge => {  connectedNodes.push(nextEdge.dest);   }  );        
    }

    document.getElementById("NodeTotalCount").innerHTML = nbrNodes;
    document.getElementById("EdgeTotalCount").innerHTML = nbrEdges;



    

}



const getRandomEdgeIndexes = (currentIndex,nbrNodes) => {

    const nbrEdges = Math.round( Math.random() * MAX_EDGE_NUMBER ) + 1;
    const indexes = [];


    for (let j=0;j<nbrEdges; ) {

        const otherNodeIndex = Math.round( Math.random() * (nbrNodes-1) );

        if ( !indexes.includes(otherNodeIndex) && otherNodeIndex !== currentIndex ){
            
            indexes.push(otherNodeIndex);
            j++;
        }
    }

    return indexes;
}



export const main = () => {

    console.log('daniel')

    init();
    render();
}

main();




