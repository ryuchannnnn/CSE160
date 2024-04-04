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

function handleDrawEvent(){
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

