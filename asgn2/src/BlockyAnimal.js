// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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
let u_ModelMatrix;
let u_GlobalRotateMatrix;

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

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix) {
    console.log("failed to get the storage loc of u_ModelMatrix");
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix) {
    console.log("failed to get the storage loc of u_GlobalRotateMatrix");
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);


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
let g_globalAngle = 0;

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

  // slider events
  document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100; });

  // size slider events
  document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes(); });

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
  // gl.clear(gl.COLOR_BUFFER_BIT);
    renderAllShapes();
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

  var globalRotMat=new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // drawTriangle3D([-1.0,0.0,0.0, -0.5,-1.0,0.0, 0.0,0.0,0.0]);

  var body = new Cube();
  body.color = [1.0,0.0,0.0,1.0];
  body.matrix.translate(-.25,-.5,0.0);
  body.matrix.scale(0.5,1,.5);
  body.render();

  var leftArm = new Cube();
  leftArm.color = [1,1,0,1];
  leftArm.matrix.translate(.7,0,0.0);
  leftArm.matrix.rotate(45,0,0,1);
  leftArm.matrix.scale(0.25,.7,.5);
  leftArm.render();

  var box = new Cube();
  box.color = [1,0,1,1];
  box.matrix.translate(0,0,-.5,0);
  box.matrix.rotate(-30,1,0,0);
  box.matrix.scale(.5,.5,.5);
  box.render();

  // check the time at the end of the function and show on webpage
  var duration = performance.now() - startTime;
  sendTextToHTML("ms: " + Math.floor(duration) + " fps: "  + Math.floor(10000/duration)/10, "numdot");

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
