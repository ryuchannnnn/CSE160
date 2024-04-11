// DrawRectangle.js
function main() {
    // Retrieve <canvas> element <- (1)
    canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    // Get the rendering context for 2DCG <- (2)
    ctx = canvas.getContext('2d');
    // // Draw a blue rectangle <- (3)
    // ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set a blue color
    // ctx.fillRect(120, 10, 150, 150); // Fill a rectangle with the color
    
    // Draw a black canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; //Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height);        // Fill the canvas with the color
    // instantiate vector
    v1 = new Vector3([2.25,2.25,0]);
    drawVector(v1, 'red');
}

// https://www.w3schools.com/html/html5_canvas.asp
function drawVector(v, color) {
    let cx = canvas.width/2;
    let cy = canvas.height/2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + v.elements[0] *  20, cy - v.elements[1] * 20);
    ctx.strokeStyle = color;
    ctx.stroke();
}

function handleDrawEvent() {
    var x1 = document.getElementById('v1x').value;
    var y1 = document.getElementById('v1y').value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);  
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with the color
    var v1 = new Vector3([x1,y1,0.0]);

    var x2 = document.getElementById('v2x').value;
    var y2 = document.getElementById('v2y').value;

    ctx.clearRect(0, 0, canvas.width, canvas.height);  
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with the color
    var v2 = new Vector3([x2,y2,0.0]);
    
    drawVector(v1,'red');
    drawVector(v2,'blue');
}

function handleDrawOperationEvent() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with the color

    var x1 = document.getElementById('v1x').value;
    var y1 = document.getElementById('v1y').value;
    var v1 = new Vector3([x1,y1,0.0]);

    var x2 = document.getElementById('v2x').value;
    var y2 = document.getElementById('v2y').value;
    var v2 = new Vector3([x2,y2,0.0]);

    drawVector(v1,'red');
    drawVector(v2,'blue');

    var operator = document.getElementById('operationMenu').value;
    if (operator == "Add"){
        v1.add(v2);
        drawVector(v1, 'green');
    } 
    else if (operator == "Subtract"){
        v1.sub(v2);
        drawVector(v1, 'green');
    } 
    else if (operator == "Multiply"){
        var scalar = document.getElementById('scalar').value;
        v1.mul(scalar);
        drawVector(v1, 'green');
        v2.mul(scalar);
        drawVector(v2, 'green');
    } 
    else if (operator == "Divide"){
        var scalar = document.getElementById('scalar').value;
        v1.div(scalar);
        drawVector(v1, 'green');
        v2.div(scalar);
        drawVector(v2, 'green');
    }
    else if (operator == "Magnitude"){
        console.log("V1's Magnitude: "+ v1.magnitude());
        console.log("V2's Magnitude: "+ v2.magnitude());
    }
    else if (operator == "Normalize"){
        drawVector(v1.normalize(), "green");
        drawVector(v2.normalize(), "green");
    }
    else if (operator == "Angle between"){
        console.log("Angle between's result is: "+(angleBetween(v1, v2)) + " degrees");
    }
    else if (operator == "Area"){
        console.log("Triangle's Area is: "+ areaTriangle(v1,v2));
    }
}

function angleBetween(v1, v2) {
    let v1mag = v1.magnitude();
    let v2mag = v2.magnitude();
    let angle = Math.acos((Vector3.dot(v1,v2))/(v1mag * v2mag));
    angle *= (180/Math.PI);
    return angle;
}

function areaTriangle(v1, v2) {
    let area = Vector3.cross(v1,v2);
    let count = area.magnitude()/2;
    return count;
}