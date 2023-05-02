// Canvas
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

// Resize canvas
const resize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 160;
}

// Tree image
const treeImg = new Image();
treeImg.src = "./images/tree.png";

// Tree object
const tree = {
  x: canvas.width,
  width: 120,
  height: Math.floor(Math.random() * (canvas.height - 200)) + 80
};

// Draw tree
function drawTree() {
  context.drawImage(treeImg, tree.x, canvas.height - tree.height, tree.width, tree.height);
}

// Bird image
const birdImg = new Image();
birdImg.src = "./images/Adler33.png";

// Bird object
const bird = {
  x: 500,
  y: (canvas.height / 2) - 100,
  width: 200,
  height: 150,
  velocity: 0.2,
  gravity: 0.14
};

// Draw bird
function drawBird() {
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

// Update tree
function updateTree() {
  tree.x -= 5;

  if (tree.x < -tree.width) {
      tree.x = canvas.width;
      tree.height = Math.floor(Math.random() * (canvas.height - 200)) + 80;
  } 
}

// Update bird
function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
}


// Bird Control
// Sound
var flapSound = new Audio("./soundeffects/flap.wav");

// Flap on "Space" key
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
      if(!started) {
          started = true;
      }
      flap();
      flapSound.play();
    }
  });

function flap() {
    bird.velocity = -3;
  }

// Gameloop
let started = false;
let request;
function gameLoop() {
  // Test for collisions
  floorCollisionTest(bird.y, bird.height, canvas.height);
  objectCollisionTest(bird.x, bird.y, bird.width, bird.height, tree.x, canvas.height - tree.height, tree.width, tree.height)
  
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
  if(started) {  
    updateBird();
    updateTree();
  } else {
    context.font = "48px Segoe";
    context.fillStyle = "red";
    context.textAlign = "center";
    context.fillText("Benutze die Leertaste zum Fliegen!", canvas.width / 2, canvas.height / 2);
  }

  drawBird();
  drawTree();

  // Endless loop
  request = requestAnimationFrame(gameLoop);
}

// Start the loop the first time
request = requestAnimationFrame(gameLoop);

// Collision Tests
var collisionSound = new Audio("./soundeffects/ouch.mp3");

function objectCollisionTest(x1, y1, width1, height1, x2, y2, width2, height2) {
    let rightEdge1 = x1 + width1;
    let rightEdge2 = x2 + width2;
    if (x2 > rightEdge1 || x1 > rightEdge2)  {
      return;
    }
    let bottomEdge1 = y1 + height1;
    let bottomEdge2 = y2 + height2;
    if (y2 > bottomEdge1 || y1 > bottomEdge2) {
      return;
    }
    endGame();
  }
  
  function floorCollisionTest(y, height, floorHeight) {
    if ((y + height) < floorHeight) {
      return;
    }
    endGame();
  } 

  // End
function endGame() {
    cancelAnimationFrame(request);
    collisionSound.play();
    bird.x = 500;
    bird.y =  (canvas.height / 2) - 100;
    tree.x = canvas.width;
    started = false;
    window.alert("Game over!"); 
  }

resize();
window.addEventListener('resize', resize);