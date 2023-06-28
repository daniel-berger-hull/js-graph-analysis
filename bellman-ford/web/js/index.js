
const svgns = "http://www.w3.org/2000/svg";




const createRectangle = () => {

    let newRect = document.createElementNS(svgns, "rect");
    newRect.setAttribute("x", "150");
    newRect.setAttribute("y", "150");
    newRect.setAttribute("width", "50");
    newRect.setAttribute("height", "100");
    newRect.setAttribute("fill", "#5cceee");

    return newRect;
}

const renderNode = (position,index) => {

    let newCircle = document.createElementNS(svgns, "circle");
    
    newCircle.setAttribute("cx", "50");
    newCircle.setAttribute("cy", "50");
    newCircle.setAttribute("r", "20");
    
    newCircle.setAttribute("x", position.x);
    newCircle.setAttribute("y", position.y);
    
    newCircle.setAttribute("fill", "#ff0000");
    newCircle.setAttribute("stroke", "#000000");
    newCircle.setAttribute("stroke-width", "3");


    return newCircle;
}

export function renderSVG() {

  
    const svg = document.querySelector("svg");
//    svg.appendChild(newRect);
    svg.appendChild( createRectangle() );
    svg.appendChild( renderNode(  { x:10, y:10 },1 ) );


    let newText = document.createElementNS(svgns, "text");
    
    newText.setAttribute("x", "400");
    newText.setAttribute("y", "400");
    newText.setAttribute("fill", "#00ffff");

    
    newText.textContent = "Dan";


    svg.appendChild( newText);
    
}
