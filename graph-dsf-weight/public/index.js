
"use strict";
// import { Graph }      from './model/Graph.js';
import { BellmanFord, GraphObject, Edge }  from './model/GraphModel.js';

import { GraphRender}   from './view/GraphRender.js';

import { CIRCULAR_GRAPH_RENDERING  , CONCENTRIC_GRAPH_RENDERING  ,RANDOM_GRAPH_RENDERING  } from './view/RenderingConstants.js';
 


const MAX_NODE_NUMBER = 15;
const MAX_NODE_VALUE  = 50;
const MAX_EDGE_NUMBER  = 2;

const ERROR_MESSAGE_TIMEOUT = 3000;


// let graph;
let graphObject;


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

    const value = document.getElementById("NodeToWorkOn").value;

    if( isNaN(value) )   {
        displayWarningMessage("Not numeric value entered!");
        return;
    }
    

      if ( (value < 0) || (value > graphObject.size()) ) {

        displayWarningMessage("Invalid Node Index entered!");
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
    
    
    // Nov 3: this section should go and use the GraphObject instead...
    // graph = new Graph(nbrNodes);
    // console.log("Init callled total nodes number is " + nbrNodes);
    // for (let i=0;i<nbrNodes;i++) {

    //     const nodeValue = Math.round( Math.random() * MAX_NODE_VALUE ) + 1;
    //     const edges = getRandomEdgeIndexes(i,nbrNodes);

    //     console.log(`${i} -- ${edges} `);

    //     edges.forEach(index => {
    //         graph.addEdge(i, index);
    //     });

    //     graph.setNodeValue(i,nodeValue);

    // }


    setEventHandlers();

    initBellman(nbrNodes);

    // By default, the rendering mode is circular
    document.getElementById('circular-rendering').checked = true;

}

function initBellman (nbrNodes) {

    const V = 7;
    const E = nbrNodes;
    graphObject = new GraphObject(V, E);

    // Nov 3
    // graphObject.edges[0] = new Edge(0, 1, 1);
    // graphObject.edges[1] = new Edge(0, 2, 4);
    // graphObject.edges[2] = new Edge(1, 2, 3);
    // graphObject.edges[3] = new Edge(1, 3, 2);
    // graphObject.edges[4] = new Edge(1, 4, 2);
    // graphObject.edges[5] = new Edge(3, 2, 5);
    // graphObject.edges[6] = new Edge(3, 1, 1);
    // graphObject.edges[7] = new Edge(4, 3, 3);

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
    console.log("Nodes Values:")
    for (let i=0;i<graphObject.getNbrNodes();i++) {
        console.log(`${i}  -> ${graphObject.getNodeValue(i)}`)
    }
}





export const render = () => {

    console.log("Render called...");
    var canvas = document.getElementById("graph-canvas");
    canvas.width = window.innerWidth - 60;



    // let renderObject = new GraphRender(canvas,graph,renderingMode);    Nov 03
    let renderObject = new GraphRender(canvas,graphObject,renderingMode);
    renderObject.draw();

    updateGraphDetailSection();
    console.log("Render called...");
   
}



/////////////////////////////////////////////////////////////////////////////////
/*                        UTILITY METHODS  SECTION                             */
/////////////////////////////////////////////////////////////////////////////////


const displayWarningMessage = (msg) => {


    const errorWarningSection  = document.getElementById("warning-section");
    const errorWarningMsg  = document.getElementById("error-warning-msg");


    errorWarningSection.style = "visibility: visible;"
    errorWarningMsg.innerHTML = msg;


    window.setTimeout(hideWarningMessage, ERROR_MESSAGE_TIMEOUT );
} 

const hideWarningMessage= () => {

    const errorWarningSection  = document.getElementById("warning-section");
    const errorWarningMsg  = document.getElementById("error-warning-msg");

    errorWarningSection.style = "visibility: hidden;"
    errorWarningMsg.innerHTML = " "

}




// The Graph Detail Section is at the bottom of the screen, under the Canvas
const updateGraphDetailSection  = () => {

    
    const nbrNodes =  graphObject.size();
    for (let i=0;i<nbrNodes;i++) {

        const nodeValue = Math.round( Math.random() * MAX_NODE_VALUE ) + 1;    

        const edgesForThisNode = graphObject.getEdgesForNode(i);    // An array of class Edges
        const connectedNodes = [];

        edgesForThisNode.forEach(nextEdge => {  connectedNodes.push(nextEdge.dest);   }  );

//        console.log(i + " value is " + " [nodeValue, edges] --> " + graphObject.getEdgesForNode(i));
        console.log(i + " value is " + " [nodeValue, edges] --> " + connectedNodes);

        
    }

    document.getElementById("NodeTotalCount").innerHTML = nbrNodes;
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




