// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform int u_whichTexture;
  void main() {
    if(u_whichTexture == -2){
      gl_FragColor = u_FragColor; // use color
    } else if(u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV,1.0,1.0); // use uv debug color
    } else if(u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV); // use texture0
    } else if(u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV); // use texture1
    } else if(u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV); // use texture2
    } else if(u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler3, v_UV); // use texture3
    } else {
      gl_FragColor = vec4(1,.2,.2,1);
    }
  }`

// global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let camera;

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

  gl.enable(gl.DEPTH_TEST);

}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  
  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of a_Position
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
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

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if(!u_ProjectionMatrix) {
    console.log("failed to get the storage loc of u_ProjectionMatrix");
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix) {
    console.log("failed to get the storage loc of u_ViewMatrix");
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix) {
    console.log("failed to get the storage loc of u_GlobalRotateMatrix");
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if(!u_Sampler0) {
    console.log('failed to get u_Sampler0 location');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if(!u_Sampler1) {
    console.log('failed to get u_Sampler1 location');
    return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if(!u_Sampler2) {
    console.log('failed to get u_Sampler2 location');
    return false;
  }

  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if(!u_Sampler3) {
    console.log('failed to get u_Sampler3 location');
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if(!u_whichTexture) {
    console.log('failed to get u_Texture location');
    return false;
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
let g_selectedSize=5;
let g_selectedType = POINT;
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_globalAngle = 180;
let g_yellowAnimation=false;
let g_magentaAnimation=false;
let dragging = false;
let g_x = 0;
let g_yAngle = 0;
let g_zAngle = 0;
let g_animation = false;
let appleSwitch = false;

// head angle
let g_headAngle = 0;
let g_leftArmJoint1 = 0;
let g_leftArmJoint2 = 0;
let g_rightArmJoint1 = 0;
let g_rightArmJoint2 = 0;
let g_leftFootAngle = 0;
let g_rightFootAngle = 0;
let g_leftEarAngle = 0;
let g_rightEarAngle = 0;

var redColor = [1.0,0.0,0.0,1.0];
var greenColor = [0.0,1.0,0.0,1.0];

// set up actions for HTML UI elements
function addActionsForHtmlUI(){
  // button 
  document.getElementById('animateOnButton').onclick = function() {g_animation = true;};
  document.getElementById('animateOffButton').onclick = function() {g_animation = false;};

  // size slider events
  document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes(); });
  document.getElementById('headSlide').addEventListener('mousemove', function() {g_headAngle = this.value; renderAllShapes(); });
  document.getElementById('leftArmJointSlide').addEventListener('mousemove', function() {g_leftArmJoint1 = this.value; renderAllShapes(); });
  document.getElementById('leftArmJoint2Slide').addEventListener('mousemove', function() {g_leftArmJoint2 = this.value; renderAllShapes(); });
  document.getElementById('rightArmJointSlide').addEventListener('mousemove', function() {g_rightArmJoint1 = this.value; renderAllShapes(); });
  document.getElementById('rightArmJoint2Slide').addEventListener('mousemove', function() {g_rightArmJoint2 = this.value; renderAllShapes(); });
  document.getElementById('leftFootAngleSlide').addEventListener('mousemove', function() {g_leftFootAngle = this.value; renderAllShapes(); });
  document.getElementById('rightFootAngleSlide').addEventListener('mousemove', function() {g_rightFootAngle = this.value; renderAllShapes(); });
  document.getElementById('leftEarAngleSlide').addEventListener('mousemove', function() {g_leftEarAngle = this.value; renderAllShapes(); });
  document.getElementById('rightEarAngleSlide').addEventListener('mousemove', function() {g_rightEarAngle = this.value; renderAllShapes(); });

}

function initTextures(){
  var image = new Image();
  if(!image){
    console.log('failed to create image obj');
    return false;
  }
  image.onload = function() {sendImageToTEXTURE0(image) };
  image.src = "floor.jpg";

  var imageSky = new Image();
  if(!imageSky){
    console.log('failed to create image obj');
    return false;
  }
  imageSky.onload = function() {sendImageToTEXTURE1(imageSky) };
  imageSky.src = "sky.jpg";

  var imageLeaf = new Image();
  if(!imageLeaf){
    console.log('failed to create image obj');
    return false;
  }
  imageLeaf.onload = function() {sendImageToTEXTURE2(imageLeaf) };
  imageLeaf.src = "oakleaves.png";

  var imageLog = new Image();
  if(!imageLog){
    console.log('failed to create image obj');
    return false;
  }
  imageLog.onload = function() {sendImageToTEXTURE3(imageLog) };
  imageLog.src = "oaklog.jpg";
  
  return true;
}

function sendImageToTEXTURE0(image) {
  var texture = gl.createTexture();
  if(!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler0, 0);
  console.log('finished loadTexture');
}

function sendImageToTEXTURE1(image) {
  var texture = gl.createTexture();
  if(!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler1, 1);
  console.log('finished loadTexture1');
}

function sendImageToTEXTURE2(image) {
  var texture = gl.createTexture();
  if(!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler2, 2);
  console.log('finished loadTexture2');
}

function sendImageToTEXTURE3(image) {
  var texture = gl.createTexture();
  if(!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler3, 3);
  console.log('finished loadTexture3');
}


function main() {

  // set up canvas and gl variables
  setUpWebGL();
  // set up glsl shaders programs and connect glsl variables
  connectVariablesToGLSL();

  // set up actions for HTML UI elements
  addActionsForHtmlUI(); 

  camera = new Camera();

  document.onkeydown = keydown;

  initTextures();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = function (e) {
    dragging = true;
    let [x,y] = convertCoordinatesEventToGL(e);
    g_lastX = x;
    g_lastY = y;

    if(e.shiftKey) {
      appleSwitch = !appleSwitch;
    }
  }
  canvas.onmousemove = function(ev) {if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  //   renderAllShapes();
    requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick() {
  g_seconds = performance.now()/1000.0-g_startTime;
  updateAnimationAngles();
  renderAllShapes();
  requestAnimationFrame(tick);
}

function updateAnimationAngles(){
  if(g_animation == true){
      g_headAngle = (5*Math.sin(g_seconds));
      g_leftArmJoint1 = (5*Math.sin(g_seconds));
      g_leftArmJoint2 = (5*Math.sin(g_seconds));
      g_rightArmJoint1 = (5*Math.sin(g_seconds));
      g_rightArmJoint2 = (5*Math.sin(g_seconds));
      g_leftFootAngle = (5*Math.sin(g_seconds));
      g_rightFootAngle = (5*Math.sin(g_seconds));
      g_leftEarAngle = (2*Math.sin(g_seconds));
      g_rightEarAngle = (2*Math.sin(g_seconds));
  }
}

// https://www.toptal.com/developers/keycode
function keydown(ev){
  console.log(ev.keyCode);
  if( ev.keyCode == 68){ // d key
    camera.moveRightD();
  }
  if( ev.keyCode == 65){// A key
    camera.moveLeftA();
  }
  if( ev.keyCode == 87){ //w key
    camera.moveForwardW();
  }
  if(ev.keyCode == 83){ // s key
    camera.moveBackwardS();
  }
  if (ev.keyCode==81){ // Q
    camera.rotateLeft();
  } else if (ev.keyCode==69){ // E
    camera.rotateRight(); 
  }
  renderAllShapes();

}

var g_eye = [0,0,3];
var g_at = [0,0,-100];
var g_up=[0,1,0];

// right
var g_map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // this tree is next to snorlax 
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // north
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,3,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,3,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

                    // left

function drawMap() {
  for(x=0;x<=32;x++) {
    for(y=0;y<=32;y++) {
      // console.log(x,y);
      if(g_map[x][y] == 1) {
        var shrubs = new Cube();
        shrubs.color = [0,1,0,0.5];
        shrubs.textureNum = 2;
        shrubs.matrix.translate(0,-0.75,0);
        shrubs.matrix.translate(x-8,0,y-8);
        shrubs.renderFaster();
      }
      if(g_map[x][y] == 2) {
        var trunk = new Cube();
        trunk.color = [0,1,0,0.5];
        trunk.textureNum = 3;
        trunk.matrix.translate(0,-0.75,0);
        trunk.matrix.translate(x-8,0,y-8);
        trunk.renderFaster();
        var trunk2 = new Cube();
        trunk2.color = [0,1,0,0.5];
        trunk2.textureNum = 3;
        trunk2.matrix.translate(0,0.25,0);
        trunk2.matrix.translate(x-8,0,y-8);
        trunk2.renderFaster();
        var leaves = new Cube();
        leaves.color = [0,1,0,0.5];
        leaves.textureNum = 2;
        leaves.matrix.translate(-1,1.25,-1);
        leaves.matrix.translate(x-8,0,y-8);
        leaves.matrix.scale(3,3,3);
        leaves.renderFaster();
      }
      if(g_map[x][y] == 3){
        var groundApple = new Cube();
        groundApple.color = [255/255,0/255,0/255,1.0];
        groundApple.matrix.translate(0,-0.75,0);
        groundApple.matrix.translate(x-8,0,y-8);
        groundApple.matrix.scale(0.5,0.5,0.5);
        groundApple.renderFaster();
        var gAStem = new Cube();
        var gAStemColor = [165/255,42/255,42/255,1.0];
        gAStem.matrix = new Matrix4(groundApple.matrix);
        gAStem.matrix.rotate(0,0,0,1);
        gAStem.matrix.scale(.25,.5,.25);
        gAStem.matrix.translate(1.5,2,1.25);
        gAStem.color = gAStemColor;
        gAStem.renderFaster();
        var gALeaf = new Cone();
        var gaLeafColor = [0/255,255/255,0/255,1.0];
        gALeaf.matrix = new Matrix4(gAStem.matrix);
        gALeaf.matrix.scale(5,5,5);
        gALeaf.matrix.translate(0.4,0.08,0.1);
        gALeaf.matrix.rotate(270,0,1,0);
        gALeaf.color = gaLeafColor;
        gALeaf.render();
        }
        if(g_map[x][y] == 4) {
          var sleepSnorlax = new Snorlax(x,y);
          sleepSnorlax.render();
        }
      }
    }
}

// var g_shapesList = [];

function click(ev) {
  
  // Extract the event click and return it in WebGL coordinates
  let [x,y] = convertCoordinatesEventToGL(ev);

  if (dragging) {
    var dx = 60 * (x - g_lastX);
    var dy = 60 * (y - g_lastY)

    g_x += dy;
    g_yAngle += dx;
    if (Math.abs(g_globalAngle / 360) > 1){
      g_Xangle = 0;
    }
    if (Math.abs(g_yAngle / 360) > 1){
      g_Yangle = 0;
    }
  
  }
  g_lastX = x;
  g_lastY = y;
 
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

  camera.renderCamera();

  var globalRotMat=new Matrix4().rotate(g_globalAngle,0,1,0);
  globalRotMat.rotate(g_yAngle, 0 , 1 ,0);
  globalRotMat.rotate(g_zAngle, 0 , 0 ,1);
  globalRotMat.rotate(g_x, 1, 0 ,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  drawMap();

  renderSnorlax();
  // draw floor 

  var floor = new Cube();
  floor.color = [1.0,0.0,0.0,1.0];
  floor.textureNum=0;
  floor.matrix.translate(7.75,-.75,8);
  floor.matrix.scale(32,0,32);
  floor.matrix.translate(-.475,0,-0.5);
  floor.renderFaster();

  // draw the sky 
  var sky = new Cube();
  sky.color = [1.0,0.0,0.0,1.0];
  sky.textureNum = 1;
  sky.matrix.scale(100,100,100);
  sky.matrix.translate(-.275,-.5,-0.25);
  sky.renderFaster();

  // // draw the red body block
  // var body = new Cube();
  // body.color = [1.0,0.0,0.0,1.0];
  // // body.textureNum=1;
  // body.matrix.translate(-.25,-.75,0.0);
  // body.matrix.rotate(-5,1,0,0);
  // body.matrix.scale(0.5,.3,.5);
  // body.renderFaster();

  // // draw the yellow cube 
  // var yellow = new Cube();
  // yellow.color = [1,1,0,1];
  // yellow.textureNum = 2;
  // yellow.matrix.setTranslate(0,-.5,0.0);
  // yellow.matrix.rotate(-5,1,0,0);
  // yellow.matrix.rotate(-g_yellowAngle,0,0,1); 
  // var yellowCoordinatesMat = new Matrix4(yellow.matrix);
  // yellow.matrix.scale(0.25,.7,.5);
  // yellow.matrix.translate(-.5,0,0);
  // yellow.renderFaster();

  // // draw the magenta block on top
  // var magenta = new Cube();
  // magenta.color = [1,0,1,1];
  // // magenta.textureNum = 2;
  // magenta.matrix = yellowCoordinatesMat;
  // magenta.matrix.translate(0,0.65,0);
  // magenta.matrix.rotate(g_magentaAngle,0,0,1);
  // magenta.matrix.scale(.3,.3,.3);
  // magenta.matrix.translate(-.5,0,-.001);
  // magenta.renderFaster();

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


function renderSnorlax() {
  var snorlaxColor = [95/255,150/255,170/255,1.0];
  var snorlaxFurColor = [241/255,229/255,215/255,0.95];
  var snorlaxFeetColor = [241/255,229/255,215/255,1.0];
  var snorlaxEyeMouthColor = [0/255,0/255,0/255,1.0];
  var snorlaxPawColor = [206/255, 194/255, 184/255, 1.0];
  var snorlaxNailColor = [255/255,255/255,255/255,1.0];

  var snorlaxHead = new Cube();
  snorlaxHead.matrix.translate(this.x - 33,0,this.y - 33);
  var AttachBodytoHead = new Matrix4(snorlaxHead.matrix);
  snorlaxHead.matrix.rotate(g_headAngle,0,0,1);
  snorlaxHead.matrix.scale(.8,.45,.8);
  snorlaxHead.matrix.translate(-.497,.4,.065);
  snorlaxHead.color = snorlaxColor;
  snorlaxHead.render();

  var snorlaxBody = new Cube();
  snorlaxBody.color = snorlaxColor;
  snorlaxBody.matrix = AttachBodytoHead;
  snorlaxBody.matrix.rotate(0,0,0,1);
  snorlaxBody.matrix.scale(1,1,.9);
  snorlaxBody.matrix.translate(-0.5,-.775,0);
  snorlaxBody.render();

  var snorlaxBodyFur = new Cube();
  snorlaxBodyFur.color = snorlaxFurColor;
  snorlaxBodyFur.matrix = new Matrix4(snorlaxBody.matrix);
  snorlaxBodyFur.matrix.rotate(0,0,0,1);
  snorlaxBodyFur.matrix.scale(.8,.9,.04);
  snorlaxBodyFur.matrix.translate(0.13,0.1,-.9);
  snorlaxBodyFur.render();

  var snorlaxFace = new Cube();
  snorlaxFace.color = snorlaxFurColor;
  snorlaxFace.matrix = new Matrix4(snorlaxHead.matrix);
  snorlaxFace.matrix.rotate(0,0,0,1);
  snorlaxFace.matrix.scale(.8,.93,.04);
  snorlaxFace.matrix.translate(0.14,-0.15,-.9);
  snorlaxFace.render();

  var snorlaxLeftEye = new Cube();
  snorlaxLeftEye.color = snorlaxEyeMouthColor;
  snorlaxLeftEye.matrix = new Matrix4(snorlaxFace.matrix);
  snorlaxLeftEye.matrix.rotate(0,0,0,1);
  snorlaxLeftEye.matrix.scale(.2,.05,.02);
  snorlaxLeftEye.matrix.translate(0.8,14,-3);
  snorlaxLeftEye.render();

  var snorlaxRightEye = new Cube();
  snorlaxRightEye.color = snorlaxEyeMouthColor;
  snorlaxRightEye.matrix = new Matrix4(snorlaxFace.matrix);
  snorlaxRightEye.matrix.rotate(0,0,0,1);
  snorlaxRightEye.matrix.scale(.2,.05,.02);
  snorlaxRightEye.matrix.translate(3.2,14,-3);
  snorlaxRightEye.render();

  var snorlaxMouth = new Cube();
  snorlaxMouth.color = snorlaxEyeMouthColor;
  snorlaxMouth.matrix = new Matrix4(snorlaxFace.matrix);
  snorlaxMouth.matrix.rotate(0,0,0,1);
  snorlaxMouth.matrix.scale(.4,.05,.02);
  snorlaxMouth.matrix.translate(.75,7,-3);
  snorlaxMouth.render();
  var snorlaxsLeftEar = new Cube();
  snorlaxsLeftEar.matrix = new Matrix4(snorlaxHead.matrix);
  snorlaxsLeftEar.matrix.rotate(g_leftEarAngle,0,0,1);
  snorlaxsLeftEar.matrix.scale(.2,.3,.2);
  snorlaxsLeftEar.matrix.translate(0.5,3.3,2);
  snorlaxsLeftEar.color = snorlaxColor;
  snorlaxsLeftEar.render();

  var snorlaxsRightEar = new Cube();
  snorlaxsRightEar.matrix = new Matrix4(snorlaxHead.matrix);
  snorlaxsRightEar.matrix.scale(.2,.3,.2);
  snorlaxsRightEar.matrix.translate(3.5,3.3,2);
  snorlaxsRightEar.matrix.rotate(g_rightEarAngle,0,0,1);
  snorlaxsRightEar.color = snorlaxColor;
  snorlaxsRightEar.render();

  var snorlaxsLeftArmJ1 = new Cube();
  snorlaxsLeftArmJ1.matrix = new Matrix4(snorlaxBody.matrix);
  snorlaxsLeftArmJ1.matrix.rotate(1,g_leftArmJoint1,0,1);
  snorlaxsLeftArmJ1.matrix.scale(.15,.25,.4);
  snorlaxsLeftArmJ1.matrix.translate(-0.8,2.5,.9);
  snorlaxsLeftArmJ1.color = snorlaxColor;
  snorlaxsLeftArmJ1.render();

  var snorlaxsLeftArmJ2 = new Cube();
  snorlaxsLeftArmJ2.matrix = new Matrix4(snorlaxsLeftArmJ1.matrix);
  snorlaxsLeftArmJ2.matrix.rotate(5,0,g_leftArmJoint2,1);
  snorlaxsLeftArmJ2.matrix.scale(1,1,1);
  snorlaxsLeftArmJ2.matrix.translate(-0.8,0,0);
  snorlaxsLeftArmJ2.color = snorlaxColor;
  snorlaxsLeftArmJ2.render();

  var snorlaxsRightArmJ1 = new Cube();
  snorlaxsRightArmJ1.matrix = new Matrix4(snorlaxBody.matrix);
  snorlaxsRightArmJ1.matrix.scale(.15,.25,.4);
  snorlaxsRightArmJ1.matrix.translate(6.66,2.5,.9);
  snorlaxsRightArmJ1.matrix.rotate(1,g_rightArmJoint1,0,1);
  snorlaxsRightArmJ1.color = snorlaxColor;
  snorlaxsRightArmJ1.render();

  var snorlaxsRightArmJ2 = new Cube();
  snorlaxsRightArmJ2.matrix = new Matrix4(snorlaxsRightArmJ1.matrix);
  snorlaxsRightArmJ2.matrix.scale(1,1,1);
  snorlaxsRightArmJ2.matrix.translate(0.7,0,0);
  snorlaxsRightArmJ2.matrix.rotate(-5,0,g_rightArmJoint2,1);
  snorlaxsRightArmJ2.color = snorlaxColor;
  snorlaxsRightArmJ2.render();

  var snorlaxsLeftClaw1 = new Cone();
  snorlaxsLeftClaw1.matrix = new Matrix4(snorlaxsLeftArmJ2.matrix);
  snorlaxsLeftClaw1.color = snorlaxNailColor;
  snorlaxsLeftClaw1.matrix.translate(-0.20,0.5,0.2);
  snorlaxsLeftClaw1.matrix.scale(1,1,1);
  snorlaxsLeftClaw1.matrix.rotate(180,1,0,1);
  snorlaxsLeftClaw1.render();

  var snorlaxsLeftClaw2 = new Cone();
  snorlaxsLeftClaw2.matrix = new Matrix4(snorlaxsLeftArmJ2.matrix);
  snorlaxsLeftClaw2.color = snorlaxNailColor;
  snorlaxsLeftClaw2.matrix.translate(-0.20,0.5,0.4);
  snorlaxsLeftClaw2.matrix.scale(1,1,1);
  snorlaxsLeftClaw2.matrix.rotate(180,1,0,1);
  snorlaxsLeftClaw2.render();

  var snorlaxsLeftClaw3 = new Cone();
  snorlaxsLeftClaw3.matrix = new Matrix4(snorlaxsLeftArmJ2.matrix);
  snorlaxsLeftClaw3.color = snorlaxNailColor;
  snorlaxsLeftClaw3.matrix.translate(-0.20,0.5,0.6);
  snorlaxsLeftClaw3.matrix.scale(1,1,1);
  snorlaxsLeftClaw3.matrix.rotate(180,1,0,1);
  snorlaxsLeftClaw3.render();

  var snorlaxsLeftClaw4 = new Cone();
  snorlaxsLeftClaw4.matrix = new Matrix4(snorlaxsLeftArmJ2.matrix);
  snorlaxsLeftClaw4.color = snorlaxNailColor;
  snorlaxsLeftClaw4.matrix.translate(-0.20,0.5,0.8);
  snorlaxsLeftClaw4.matrix.scale(1,1,1);
  snorlaxsLeftClaw4.matrix.rotate(180,1,0,1);
  snorlaxsLeftClaw4.render();

  var snorlaxsLeftClaw5 = new Cone();
  snorlaxsLeftClaw5.matrix = new Matrix4(snorlaxsLeftArmJ2.matrix);
  snorlaxsLeftClaw5.color = snorlaxNailColor;
  snorlaxsLeftClaw5.matrix.translate(-0.20,0.5,1);
  snorlaxsLeftClaw5.matrix.scale(1,1,1);
  snorlaxsLeftClaw5.matrix.rotate(180,1,0,1);
  snorlaxsLeftClaw5.render();

  var snorlaxsRightClaw1 = new Cone();
  snorlaxsRightClaw1.matrix = new Matrix4(snorlaxsRightArmJ2.matrix);
  snorlaxsRightClaw1.color = snorlaxNailColor;
  snorlaxsRightClaw1.matrix.translate(1.20,.5,0.2);
  snorlaxsRightClaw1.matrix.scale(1,1,1);
  snorlaxsRightClaw1.matrix.rotate(270,0,1,0);
  snorlaxsRightClaw1.render();

  var snorlaxsRightClaw2 = new Cone();
  snorlaxsRightClaw2.matrix = new Matrix4(snorlaxsRightArmJ2.matrix);
  snorlaxsRightClaw2.color = snorlaxNailColor;
  snorlaxsRightClaw2.matrix.translate(1.20,.5,0.4);
  snorlaxsRightClaw2.matrix.scale(1,1,1);
  snorlaxsRightClaw2.matrix.rotate(270,0,1,0);
  snorlaxsRightClaw2.render();

  var snorlaxsRightClaw3 = new Cone();
  snorlaxsRightClaw3.matrix = new Matrix4(snorlaxsRightArmJ2.matrix);
  snorlaxsRightClaw3.color = snorlaxNailColor;
  snorlaxsRightClaw3.matrix.translate(1.20,.5,0.6);
  snorlaxsRightClaw3.matrix.scale(1,1,1);
  snorlaxsRightClaw3.matrix.rotate(270,0,1,0);
  snorlaxsRightClaw3.render();

  var snorlaxsRightClaw4 = new Cone();
  snorlaxsRightClaw4.matrix = new Matrix4(snorlaxsRightArmJ2.matrix);
  snorlaxsRightClaw4.color = snorlaxNailColor;
  snorlaxsRightClaw4.matrix.translate(1.20,.5,0.8);
  snorlaxsRightClaw4.matrix.scale(1,1,1);
  snorlaxsRightClaw4.matrix.rotate(270,0,1,0);
  snorlaxsRightClaw4.render();

  var snorlaxsRightClaw5 = new Cone();
  snorlaxsRightClaw5.matrix = new Matrix4(snorlaxsRightArmJ2.matrix);
  snorlaxsRightClaw5.color = snorlaxNailColor;
  snorlaxsRightClaw5.matrix.translate(1.20,.5,1);
  snorlaxsRightClaw5.matrix.scale(1,1,1);
  snorlaxsRightClaw5.matrix.rotate(270,0,1,0);
  snorlaxsRightClaw5.render();
  
  var snorlaxsLeftFoot = new Cube();
  snorlaxsLeftFoot.matrix = new Matrix4(snorlaxBody.matrix);
  snorlaxsLeftFoot.matrix.rotate(g_leftFootAngle,0,0,1);
  snorlaxsLeftFoot.matrix.scale(.33,.33,.2);
  snorlaxsLeftFoot.matrix.translate(0,.005,-1);
  snorlaxsLeftFoot.color = snorlaxFeetColor;
  snorlaxsLeftFoot.render();

  var snorlaxsLFLeftToe = new Cube();
  snorlaxsLFLeftToe.matrix = new Matrix4(snorlaxsLeftFoot.matrix);
  snorlaxsLFLeftToe.matrix.rotate(0,0,0,1);
  snorlaxsLFLeftToe.matrix.scale(.2,.2,.2);
  snorlaxsLFLeftToe.matrix.translate(.5,5,0);
  snorlaxsLFLeftToe.color = snorlaxNailColor;
  snorlaxsLFLeftToe.render();

  var snorlaxsLFMiddleToe = new Cube();
  snorlaxsLFMiddleToe.matrix = new Matrix4(snorlaxsLeftFoot.matrix);
  snorlaxsLFMiddleToe.matrix.rotate(0,0,0,1);
  snorlaxsLFMiddleToe.matrix.scale(.2,.2,.2);
  snorlaxsLFMiddleToe.matrix.translate(2.1,5,0);
  snorlaxsLFMiddleToe.color = snorlaxNailColor;
  snorlaxsLFMiddleToe.render();

  var snorlaxsLFRightToe = new Cube();
  snorlaxsLFRightToe.matrix = new Matrix4(snorlaxsLeftFoot.matrix);
  snorlaxsLFRightToe.matrix.rotate(0,0,0,1);
  snorlaxsLFRightToe.matrix.scale(.2,.2,.2);
  snorlaxsLFRightToe.matrix.translate(3.66,5,0);
  snorlaxsLFRightToe.color = snorlaxNailColor;
  snorlaxsLFRightToe.render();

  var snorlaxsRightFoot = new Cube();
  snorlaxsRightFoot.matrix = new Matrix4(snorlaxBody.matrix);
  snorlaxsRightFoot.matrix.scale(.33,.33,.2);
  snorlaxsRightFoot.matrix.translate(2.05,.005,-1);
  snorlaxsRightFoot.matrix.rotate(g_rightFootAngle,0,0,1);
  snorlaxsRightFoot.color = snorlaxFeetColor;
  snorlaxsRightFoot.render();

  var snorlaxsRFLeftToe = new Cube();
  snorlaxsRFLeftToe.matrix = new Matrix4(snorlaxsRightFoot.matrix);
  snorlaxsRFLeftToe.matrix.rotate(0,0,0,1);
  snorlaxsRFLeftToe.matrix.scale(.2,.2,.2);
  snorlaxsRFLeftToe.matrix.translate(.5,5,0);
  snorlaxsRFLeftToe.color = snorlaxNailColor;
  snorlaxsRFLeftToe.render();

  var snorlaxsRFMiddleToe = new Cube();
  snorlaxsRFMiddleToe.matrix = new Matrix4(snorlaxsRightFoot.matrix);
  snorlaxsRFMiddleToe.matrix.rotate(0,0,0,1);
  snorlaxsRFMiddleToe.matrix.scale(.2,.2,.2);
  snorlaxsRFMiddleToe.matrix.translate(2.1,5,0);
  snorlaxsRFMiddleToe.color = snorlaxNailColor;
  snorlaxsRFMiddleToe.render();

  var snorlaxsRFRightToe = new Cube();
  snorlaxsRFRightToe.matrix = new Matrix4(snorlaxsRightFoot.matrix);
  snorlaxsRFRightToe.matrix.rotate(0,0,0,1);
  snorlaxsRFRightToe.matrix.scale(.2,.2,.2);
  snorlaxsRFRightToe.matrix.translate(3.66,5,0);
  snorlaxsRFRightToe.color = snorlaxNailColor;
  snorlaxsRFRightToe.render();

  var snorlaxsRightPaw = new Cube();
  snorlaxsRightPaw.matrix = new Matrix4(snorlaxsRightFoot.matrix);
  snorlaxsRightPaw.matrix.rotate(0,0,0,1);
  snorlaxsRightPaw.matrix.scale(.65,.5,.2);
  snorlaxsRightPaw.matrix.translate(0.275,.15,-1);
  snorlaxsRightPaw.color = snorlaxPawColor;
  snorlaxsRightPaw.render();

  var snorlaxsLeftPaw = new Cube();
  snorlaxsLeftPaw.matrix = new Matrix4(snorlaxsLeftFoot.matrix);
  snorlaxsLeftPaw.matrix.rotate(0,0,0,1);
  snorlaxsLeftPaw.matrix.scale(.65,.5,.2);
  snorlaxsLeftPaw.matrix.translate(0.275,.15,-1);
  snorlaxsLeftPaw.color = snorlaxPawColor;
  snorlaxsLeftPaw.render();

  var appleColor = [255/255,0/255,0/255,1.0];
  var stemColor = [165/255,42/255,42/255,1.0];
  var leafColor = [0/255,255/255,0/255,1.0];
  if(appleSwitch){
    var apple = new Cube();
    var stem = new Cube();
    var leaf = new Cone();
    apple.matrix.rotate(0,0,0,1);
    apple.matrix.scale(.25,.25,.25);
    apple.matrix.translate(-0.5,2.5,0);
    apple.color = appleColor;
    stem.matrix = new Matrix4(apple.matrix);
    stem.matrix.rotate(0,0,0,1);
    stem.matrix.scale(.25,.5,.25);
    stem.matrix.translate(1.5,2,1);
    stem.color = stemColor;
    leaf.matrix = new Matrix4(stem.matrix);
    leaf.matrix.scale(5,5,5);
    leaf.matrix.translate(0.4,0.08,0.1);
    leaf.matrix.rotate(270,0,1,0);
    leaf.color = leafColor;
    stem.render();
    apple.render();
    leaf.render();
  }
}

console.log('done');