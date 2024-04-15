// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    // gl_PointSize = 30.0;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setUpWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  
  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  
  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_FragColor
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

}

// constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// globals related to UI elements
let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize=100;
let g_selectedType = POINT;
let g_numSegments = 100;

var redColor = [1.0,0.0,0.0,1.0];
var greenColor = [0.0,1.0,0.0,1.0];

// set up actions for HTML UI elements
function addActionsForHtmlUI(){

  // button events
  document.getElementById('green').onclick = function() {g_selectedColor = [0.0,1.0,0.0,1.0];};
  document.getElementById('red').onclick = function() {g_selectedColor = [1.0,0.0,0.0,1.0];};
  document.getElementById('clearButton').onclick = function() {g_shapesList = []; renderAllShapes();};

  document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
  document.getElementById('triButton').onclick = function() {g_selectedType=TRIANGLE};
  document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE};
  
  document.getElementById('strawberry').onclick = function() {redColor; generateStrawberryRed();};
  document.getElementById('changeStrawberryColor').onclick = function() {generateRandomStrawberryColor();};

  // slider events
  document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100; });

  // size slider events
  document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value; });
  document.getElementById("segmentSlide").addEventListener("mouseup", function () {g_numSegments = this.value;});

}

function main() {

  // set up canvas and gl variables
  setUpWebGL();
  // set up glsl shaders programs and connect glsl variables
  connectVariablesToGLSL();

  // set up actions for HTML UI elements
  addActionsForHtmlUI(); 

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  // canvas.onmousemove = click;
  canvas.onmousemove = function(ev) {if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}


var g_shapesList = [];

function click(ev) {

  // Extract the event click and return it in WebGL coordinates
  [x,y] = convertCoordinatesEventToGL(ev);

  // create and store the new point
  let point;
  if(g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
    point.segments = g_numSegments;
  }
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);

  // draw every shape that is supposed to be in the canvas 
  renderAllShapes();

}

// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}


// draw every shape that is supposed to be in the canvas
function renderAllShapes(){

  // check the time at the start of this function
  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;

  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  // check the time at the end of the function and show on webpage
  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: "  + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");

}

// set the text of an HTML element
function sendTextToHTML(text,htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlID) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

function generateStrawberryRed(){
  // strawberry
  var t1 = new Triangle();
  t1.color = redColor;
  t1.size = 25.0;
  // tri1
  generateStrawberryBits([-0.2,-0.6, 0,-0.9, 0.2,-0.6], redColor, t1.size);
  // tri 5          Top left // middle pointing down // top right point
  generateStrawberryBits([-0.58,0.2, -0.4,-0.18, -0.28,0.2], redColor, t1.size);
  // tri 10
  generateStrawberryBits([0.58,0.2, 0.4,-0.18, 0.28,0.2], redColor, t1.size);
  // tri 2
  generateStrawberryBits([-0.4,-0.2, -0.1,-0.35, -0.2, -0.55], redColor, t1.size);
  // tri 4
  generateStrawberryBits([0.4,-0.2, 0.1,-0.35, 0.2, -0.55], redColor, t1.size);
  var t2 = new Triangle();
  t2.size = 5.0;
  // tri 3
  generateStrawberryBits([-0.17, -0.55, 0,-0.3, 0.17, -0.55], redColor, t2.size);
  var t3 = new Triangle();
  t3.size = 10.0;
  // tri 7
  generateStrawberryBits([-0.35, -0.1, -0.12,-0.3, 0.001,-0.1],redColor, t3.size);
  // tri 8 
  generateStrawberryBits([0.005, -0.1, 0.12,-0.3, 0.35,-0.1],redColor, t3.size);
  // tri 6
  generateStrawberryBits([-0.25,0.2, -0.12,-0.09, 0.005,0.2],redColor, t3.size);
  // tri 9 
  generateStrawberryBits([0.005, 0.2, 0.12,-0.09, 0.25,0.2],redColor, t3.size);

  var t4 = new Triangle();
  t4.color = greenColor;
  // t11
  generateStrawberryBits([-0.35, 0.4, -0.48, 0.6, -0.46, 0.2], greenColor, t1.size);
  // t12
  generateStrawberryBits([-0.6, 0.4, -0.48, 0.6, -0.46, 0.2], greenColor, t1.size);
  // t13
  generateStrawberryBits([-0.33, 0.405, -0.20, 0.6, -0.195, 0.215], greenColor, t1.size);
  // t14
  generateStrawberryBits([-0.08, 0.405, -0.20, 0.6, -0.195, 0.215], greenColor, t1.size);
  // t15 
  generateStrawberryBits([-0.075, 0.405, 0.05, 0.595, 0.06, 0.225], greenColor, t1.size);
  // t16 
  generateStrawberryBits([0.175, 0.405, 0.05, 0.595, 0.06, 0.225], greenColor, t1.size);
  // t17
  generateStrawberryBits([0.15, 0.405, 0.278, 0.595, 0.27, 0.245], greenColor, t1.size);
  // t18
  generateStrawberryBits([0.40, 0.405, 0.278, 0.595, 0.27, 0.245], greenColor, t1.size);
  // t19
  generateStrawberryBits([0.415, 0.405, 0.53, 0.585, 0.53, 0.23], greenColor, t1.size);
  // t20
  generateStrawberryBits([0.635, 0.405, 0.53, 0.585, 0.53, 0.23], greenColor, t1.size);
}


function generateRandomStrawberryColor() {
  // Function to generate random RGB color
  function getRandomColor() {
      var r = (Math.random() * 1);
      var g = (Math.random() * 1);
      var b = (Math.random() * 1);
      var randomGenColor = [r,g,b,1.0];
      return randomGenColor;
  }

  // Randomly generated color for the strawberry
  var randomColor = getRandomColor();

  // strawberry
  var t1 = new Triangle();
  t1.color = randomColor;
  t1.size = 25.0;
  // tri1
  generateStrawberryBits([-0.2, -0.6, 0, -0.9, 0.2, -0.6], randomColor, t1.size);
  // tri 5          Top left // middle pointing down // top right point
  generateStrawberryBits([-0.58, 0.2, -0.4, -0.18, -0.28, 0.2], randomColor, t1.size);
  // tri 10
  generateStrawberryBits([0.58, 0.2, 0.4, -0.18, 0.28, 0.2], randomColor, t1.size);
  // tri 2
  generateStrawberryBits([-0.4, -0.2, -0.1, -0.35, -0.2, -0.55], randomColor, t1.size);
  // tri 4
  generateStrawberryBits([0.4, -0.2, 0.1, -0.35, 0.2, -0.55], randomColor, t1.size);
  var t2 = new Triangle();
  t2.size = 5.0;
  // tri 3
  generateStrawberryBits([-0.17, -0.55, 0, -0.3, 0.17, -0.55], randomColor, t2.size);
  var t3 = new Triangle();
  t3.size = 10.0;
  // tri 7
  generateStrawberryBits([-0.35, -0.1, -0.12, -0.3, 0.001, -0.1], randomColor, t3.size);
  // tri 8 
  generateStrawberryBits([0.005, -0.1, 0.12, -0.3, 0.35, -0.1], randomColor, t3.size);
  // tri 6
  generateStrawberryBits([-0.25, 0.2, -0.12, -0.09, 0.005, 0.2], randomColor, t3.size);
  // tri 9 
  generateStrawberryBits([0.005, 0.2, 0.12, -0.09, 0.25, 0.2], randomColor, t3.size);

  var t4 = new Triangle();
  t4.color = greenColor;
  // t11
  generateStrawberryBits([-0.35, 0.4, -0.48, 0.6, -0.46, 0.2], greenColor, t1.size);
  // t12
  generateStrawberryBits([-0.6, 0.4, -0.48, 0.6, -0.46, 0.2], greenColor, t1.size);
  // t13
  generateStrawberryBits([-0.33, 0.405, -0.20, 0.6, -0.195, 0.215], greenColor, t1.size);
  // t14
  generateStrawberryBits([-0.08, 0.405, -0.20, 0.6, -0.195, 0.215], greenColor, t1.size);
  // t15 
  generateStrawberryBits([-0.075, 0.405, 0.05, 0.595, 0.06, 0.225], greenColor, t1.size);
  // t16 
  generateStrawberryBits([0.175, 0.405, 0.05, 0.595, 0.06, 0.225], greenColor, t1.size);
  // t17
  generateStrawberryBits([0.15, 0.405, 0.278, 0.595, 0.27, 0.245], greenColor, t1.size);
  // t18
  generateStrawberryBits([0.40, 0.405, 0.278, 0.595, 0.27, 0.245], greenColor, t1.size);
  // t19
  generateStrawberryBits([0.415, 0.405, 0.53, 0.585, 0.53, 0.23], greenColor, t1.size);
  // t20
  generateStrawberryBits([0.635, 0.405, 0.53, 0.585, 0.53, 0.23], greenColor, t1.size);
}
