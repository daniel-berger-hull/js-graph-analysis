 

const INF = 2147483647;


export function BellmanFord(graph, src) {
    const V = graph.getNbrNodes();
     const E = graph.getNbrEdges();
     const dist = [];
     
     for (let i = 0; i < V; i++) {
         dist[i] = Number.MAX_SAFE_INTEGER;
     }
     dist[src] = 0;
     
     for (let i = 1; i <= V - 1; i++) {
         for (let j = 0; j < E; j++) {
         const u = graph.edges[j].src;
         const v = graph.edges[j].dest;
         const weight = graph.edges[j].weight;
         if (dist[u] !== Number.MAX_SAFE_INTEGER && dist[u] + weight < dist[v]) {
             dist[v] = dist[u] + weight;
         }
         }
     }
     
     for (let i = 0; i < E; i++) {
         const u = graph.edges[i].src;
         const v = graph.edges[i].dest;
         const weight = graph.edges[i].weight;
         if (dist[u] !== Number.MAX_SAFE_INTEGER && dist[u] + weight < dist[v]) {
         console.log("Graph contains negative weight cycle");
         return;
         }
     }
 
         graph.printArr(dist);
     }
     
 
 
 
    
 export function shortestPath(graph,src) {
 
         const nbrNodes = graph.getNbrNodes();
           // Create a priority queue to store vertices that are being preprocessed. This is weird syntax in C++.
           // Refer below link for details of this syntax
           // https://www.geeksforgeeks.org/implement-min-heap-using-stl/
           let pq = [];
    
           // Create a vector for distances and initialize all
           // distances as infinite (INF)
           let dist = new Array(nbrNodes).fill(INF);
           let counts = new Array(nbrNodes).fill(0);
           
 
           //let nodesPath = [];
 
           let nodesPath = new Array(nbrNodes);

           let allLetters = new Array(5);



    allLetters[0] = 'P';
    allLetters[1] = 'P';
    allLetters[2] = 'P';
    allLetters[3] = 'P';
    allLetters[4] = 'P';
 
          
 
 
           //let nodesPath = [];
           //nodesPath.push(src);
    
 
           //nodesPath.push(src);
 
           // Insert source itself in priority queue and initialize
           // its distance as 0.
 //          pq.push([0, src]);   // Nov 13
           pq.push([0, src]);
           //nodesPath[0] = [0];
 
           for (let i=0;i<nbrNodes;i++) {
             nodesPath[i] = [0];
           }
 
           dist[src] = 0;
    
           /* Looping till priority queue becomes empty (or all distances are not finalized) */
           while (pq.length > 0) {
               // The first vertex in pair is the minimum distance vertex, extract it from priority queue. vertex label is stored in second of pair (it
               // has to be done this way to keep the vertices sorted distance (distance must be first item in pair)
               let u = pq[0][1];
               pq.shift();
 
             
 
             const connectedNodes = [];
             const edgesForThisNode = graph.getEdgesForNode(u);    // Returns An array of class Edges
               
             edgesForThisNode.forEach(nextEdge => {  connectedNodes.push(nextEdge.dest);   }  );
 
 
               // 'i' is used to get all adjacent vertices of a vertex
             for(let i = 0; i < connectedNodes.length; i++){
                                    
                   // Get vertex label and weight of current adjacent of u.
                 let v = connectedNodes[i];
                 let currrentEdge = edgesForThisNode[i];
                 let weight =  currrentEdge.weight;
                 
                   // If there is shorted path to v through u.
                   if (dist[v] > dist[u] + weight) {
                       // Updating distance of v
                       dist[v] = dist[u] + weight;
                       pq.push([dist[v], v]);
                       pq.sort((a, b) =>{
                           if(a[0] == b[0]) return a[1] - b[1];
                           return a[0] - b[0];
                       });
 
                       nodesPath[v].push(u);
 
                       counts[v] = counts[u] + 1;

                       allLetters[v] = allLetters[u] + u;
 
                       //console.log("counts[" + v + "] increment to " + counts[v]);
                   }
               }
           }

           for (let i=0;i<allLetters.length;i++) {
            allLetters[i] =  allLetters[i] + i;
          }

    
 
           console.log("Nodes in Path:");
           console.log(nodesPath);
           console.log("Counts:");
           console.log(counts);
           console.log("Distances:");
           console.log(dist);

           console.log('All Letters Array:');
            console.log(allLetters);


           
           return dist;
   }
   
 