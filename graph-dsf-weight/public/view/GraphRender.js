"use strict";


import  { determinePos } from './NodeSpaceLocator.js';

import { CIRCULAR_GRAPH_RENDERING  , CONCENTRIC_GRAPH_RENDERING  ,RANDOM_GRAPH_RENDERING  } from './RenderingConstants.js';

import { NODE_NOT_DEFINED } from '../model/GraphModel.js';

import { shortestPath }  from '../model/PathFind.js';


// This class should only draw on the Canvas, and the calculations required, like the locations of the node shouhld be delegated to some other classes or functions...
// The reason is that the way we spread the nodes on a the screen can be done in many differents ways, but things like draw a node or segment alway stay the same and should be done in this class only


export class GraphRender {


    #canvas;   
    #graphObject;
    #renderingMode;

    constructor(targetCanvas, graph, renderingMode) {

        this.#validateParams(targetCanvas,graph);

        this.#canvas = targetCanvas;
        this.#graphObject = graph;
        this.#renderingMode = renderingMode;
        this.#init();
    }

    #validateParams(targetCanvas, graph){

        if ( targetCanvas === null || typeof targetCanvas === "undefined") 
           throw "You MUST provide a valid Canvas object to the GraphRender class!";
           if ( graph === null || typeof graph === "undefined") 
           throw "You MUST provide a valid Graph object GraphRender class!";


    }

    #init() {

        //Note the init may be removed later if no usage is done...
    }


    getCanvas()                  { return this.#canvas;         };
    getGraph()                   { return this.#graphObject;    };
    getRenderingMode()           { return this.#renderingMode;  };    


    setCanvas(canvas)            {  this.#canvas = canvas;       }
    setGraph(graph)              {  this.#graphObject = graph;   };
    setRenderingMode(mode)       {  this.#renderingMode;  };    


    #isValidRenderingMode(mode) {
        if (mode < CIRCULAR_GRAPH_RENDERING || mode > RANDOM_GRAPH_RENDERING)  return false;
        else
            return true;



    }


    renderNode(context, position, size , value, highlightNode) {

        context.strokeStyle = "#FBED20";
        context.beginPath();
        context.arc(position.x, position.y, size, 0, 2 * Math.PI);

        context.fillStyle = (highlightNode === true) ?  'white' : 'blue' ;

        context.fill();
        context.lineWidth = 2;
        context.stroke();

        context.textAlign = "center";
        context.textBaseline = "middle"; 
        context.font = "12px Arial";
        const label = value;

        context.fillStyle = "black";
        context.fillText(label, position.x+1, position.y+1);

        context.fillStyle = (highlightNode === true) ? "#0046BE" : 'white';
        context.fillText(label, position.x, position.y);    
    }

    renderSegment (context, startPos, endPos, color) {
    
        context.beginPath();
        context.moveTo(startPos.x, startPos.y);
        context.lineTo(endPos.x, endPos.y);
        context.strokeStyle = color;
        context.lineWidth = 1;
        
        context.stroke(); 
    }

    renderLoopSegment (context, position, size, color) {
    
        context.beginPath();
        context.arc(position.x, position.y-(size*1.3), size, 0, 2 * Math.PI);

        context.lineWidth = 1;
        context.stroke();
        
    }


    getCanvasSpecs () {

        return { width: this.#canvas.width,
                 height: this.#canvas.height};
    }


    // This methods draws all the possible edges present in the graph...
    drawSegments(ctx, graph, nodePosArray) {

        console.log("%c drawSegments","color: red");

        for (let i=0;i<graph.size();i++) {
            const nextNodeValue = graph.getNodeValue(i);
            const startNodePos =   { x: nodePosArray[i].x,        
                                     y: nodePosArray[i].y };


            const edges =  graph.getEdgesForNode(i);
            edges.forEach( nextEdge => { 

                if (nextEdge.dest !== nextEdge.src) {
                   // console.log(i + " to " + index);
                    const endNodePos =   { x: nodePosArray[nextEdge.dest].x,   y: nodePosArray[nextEdge.dest].y };
                    this.renderSegment(  ctx,  startNodePos,  endNodePos, "#00FF00"); 
                } else {
                    console.log("Render: an edge on the same node detected!");
                    this.renderLoopSegment (ctx, startNodePos,  10, "#00FF00");
                }
               
            });    
        }
    }


    // This method highlights a particual path, that is normally, found by the DFS or Disjkstas algo, so that we can quikly visualize the result of the path searching... 
    drawPath(ctx, graph, nodePosArray) {

        const startNode = graph.getStartNodePath();
        const endtNode = graph.getEndNodePath();

        if (startNode === NODE_NOT_DEFINED || endtNode === NODE_NOT_DEFINED)  return;


        const results = shortestPath(graph,startNode);
        const distances = results.distances;
        const paths = results.nodesPath;
  
        const pathToHighlight = paths[endtNode];
        
        let startIndex = pathToHighlight[0];

        
        let startNodePos =   { x: nodePosArray[startIndex].x,        
                               y: nodePosArray[startIndex].y };        

        for (let i=1;i<pathToHighlight.length;i++) {

            

            startIndex = pathToHighlight[i-1];
            let endIndex = pathToHighlight[i];
            let endNodePos =   {   x: nodePosArray[endIndex].x,        
                                   y: nodePosArray[endIndex].y }; 

            this.renderSegment(  ctx,  startNodePos,  endNodePos, "#FF0000"); 
            startNodePos = endNodePos;
        }

    }


    drawNodes(ctx,  graph, nodePosArray) {

        // Draw the node on top of the segments...
        nodePosArray.forEach( (pos,index) => { 

            if ( index === graph.getStartNodePath() || index === graph.getEndNodePath() ) {
                this.renderNode( ctx, pos, 10 ,  index  ,true) ; 
            } else
                this.renderNode( ctx, pos, 10 ,  index  ,false) ; 
        });
    }

    draw() {

        var ctx = this.#canvas.getContext("2d");
        const graph = this.#graphObject;
        const nodePositions = determinePos( graph, this.getCanvasSpecs(), this.getRenderingMode()  );

        this.drawSegments(ctx, graph, nodePositions);
        // Nov 3: Needs to adapte the DFS to fit with the Weighted graph, as the original DFS implemation in Graph.js, is dealing with no weights on the nodes
        this.drawPath(ctx, graph, nodePositions);
        this.drawNodes(ctx, graph, nodePositions);
    }


}