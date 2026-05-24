/* VARIABLES */
let playButton;
let butterfly, obstacle, flower, water, grass;
let butterflyImg, obstacleImg, grassImg;
let screen = 0;
let score = 0;
let gameOver = false;
let resourceImages = [];
let fallingObject;

let upPressed = false;
let downPressed = false;

/* PRELOAD LOADS FILES */
function preload(){
  butterflyImg = loadImage('assets/butterfly.png');
  grassImg = loadImage('assets/grass.png');
  resourceImages.push({ image: loadImage('assets/water.png'), scale: 0.1 });
  resourceImages.push({ image: loadImage('assets/flower.png'), scale: 0.08 });
}

/* SETUP RUNS ONCE */
function setup() {
  createCanvas(400, 600);
  textAlign(CENTER);
  rectMode(CENTER);
  textSize(20);
  noStroke();
  if (p5.prototype.p5play) {
    p5.prototype.p5play.mouseTracking = true;
    p5.prototype.p5play.standardizeKeyboard = true;
  }

  // Set up the home screen
  background("skyblue");
  homeScreen();

  // Create button
  playButton = new Sprite(width / 2, height / 2 + 100); 

  // Create falling object
  fallingObject = new Sprite(410, 200, 10, 'dynamic'); 
  fallingObject.color = color(0, 128, 128);
  fallingObject.rotationLock = true; // Prevent rotation
  randomizeResourceImage();

  // Create Obstacles
  obstacle = new Sprite(610, random(100, 500), 50, 50, 'dynamic');
  obstacle.color = color(255, 0, 0);
  obstacle.rotationLock = true; // Prevent rotation
}

/* DRAW LOOP REPEATS */
function draw() {
  if (screen === 0) {
    displayPlayButton();
    image(grassImg, -50, 420, 510, 190);
    image(butterflyImg, 145, 110, 100, 100);
    /*if (playButton.mouse.pressed()) {
      console.log("Play button clicked!");
      showScreen1();
    } */
   
    //temp play button fix
    if (mouseIsPressed) {
      if (mouseX >= playButton.x - playButton.w/2 &&
          mouseX <= playButton.x + playButton.w/2 &&
          mouseY >= playButton.y - playButton.h/2 &&
          mouseY <= playButton.y + playButton.h/2) {
        showScreen1();
      }
    }
  } else if (screen === 1) {
    gameScreen();
    image(grassImg, -50, 420, 510, 190);

    butterflyMove(); // Ensure butterfly movement is checked in game screen

    // If fallingObject collides with butterfly, move back to random position at right
    if (butterfly.collides(fallingObject)) {
      console.log("Collision with resource detected"); // Debug statement
      fallingObject.x = 400;
      fallingObject.y = random(100, 500);
      fallingObject.vel.x = -2;
      randomizeResourceImage();
      butterfly.vel.x = 0;
      score = score + 1;
    }

    // If obstacle collides with butterfly, end the game or handle accordingly
    if (butterfly.collides(obstacle)) {
      console.log("Collision with obstacle detected"); // Debug statement
      gameOver = true;
      textSize(30);
      butterfly.vel.x = 0;
      text("Game Over", width / 2, height / 2 - 100);
      noLoop();
    }
  }

  allSprites.draw(); //drawSprites()
}

/* FUNCTIONS */
function homeScreen() {
  textSize(25);
  fill("rebeccapurple");
  text("Welcome to a Butterfly's Journey!", width / 2, 90);
  textSize(12);
  fill("black");
  text("Control a butterfly gliding through a vibrant meadow.\nNavigate around obstacles, and collect resources for\nthe butterfly to grow along the way while aiming\nfor high scores to win the game. Experience\nthe challenging and exciting life of a butterfly,\n embodying the spirit of hope and resilience today!", width / 2, height / 2 - 70);
  textSize(20);
}

function displayPlayButton() {
  playButton.w = 170;
  playButton.h = 60;
  playButton.collider = "static";
  playButton.shape = "box";
  playButton.color = "darkcyan";
  playButton.text = "Play";
}

function showScreen1() {
  screen = 1;
  playButton.remove(); // Remove the play button

  // Create Butterfly
  butterfly = new Sprite(width / 2 - 80, height / 2, 'dynamic'); 
  butterfly.addImage(butterflyImg);
  butterfly.scale = 0.2;
  butterfly.rotationLock = true; // Prevent rotation
  butterfly.collider = "dynamic";
  butterfly.vel.x = 0; // Initialize horizontal velocity to zero
  butterfly.vel.y = 0; // Initialize vertical velocity to zero

  // Start obstacle movement when the game starts
  obstacle.vel.x = -2;
}

function keyPressed() {
  if (key === "ArrowUp"){
     upPressed = true; 
  }
  if (key === "ArrowDown") {
    downPressed = true;
  }
}

function keyReleased() {
  if (key === "ArrowUp") {
    upPressed = false;
  }
  if (key === "ArrowDown") {
    downPressed = false;
  }
}

/*function butterflyMove() {
  butterfly.vel.y = 0; // Reset vertical movement first
  if (kb.pressing("up")) {
    butterfly.vel.y = -5;
  } else if (kb.pressing("down")) {
    butterfly.vel.y = 5;
  } */

  //temp butterfly movement fix
function butterflyMove() {
  butterfly.vel.y = 0;
  if (upPressed) {
    butterfly.vel.y = -5;
  }
  if (downPressed) {
    butterfly.vel.y = 5; 
  }   


  // Keep the butterfly within the canvas
  if (butterfly.y < 50) {
    butterfly.y = 50;
  }
  if (butterfly.y > 550) {
    butterfly.y = 550;
  }
}

function gameScreen() {
  background("skyblue");
  // Draw score
  fill("black");
  textSize(17);
  text("Score = " + score, 185, 30);
  fallingObject.draw(); // Draw falling object
  fallingObject.vel.x = -2;
  // If fallingObject reaches left, move back to random position at right 
  if (fallingObject.x <= 0) {
    randomizeResourceImage();
    fallingObject.x = 400;
    fallingObject.y = random(100, 500);
    fallingObject.vel.x = -2;
  }

  obstacle.draw(); // Draw obstacle
  // If obstacle reaches left, move back to random position at right 
  if (obstacle.x <= 0) {
    obstacle.x = 400;
    obstacle.y = random(100, 500);
  }

  butterfly.draw(); // Draw the butterfly
  print("Game Started");
  textSize(10);
  text("Guide your butterfly using \nthe arrow keys to navigate \nthrough the meadow. Collect \nresources to grow and avoid \nobstacles. Reach the end", 80, 25);
}

/// Random resources
function randomizeResourceImage() {
  const randomFallingObject = random(resourceImages);
  fallingObject.addImage(randomFallingObject.image);
  fallingObject.scale = randomFallingObject.scale;
}
