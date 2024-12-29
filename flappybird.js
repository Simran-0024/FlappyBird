// board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;// for maintaining the ratio (408/228)==17/12
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;


let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight
}
// pipes
let pipeArray = [];
let pipeWidth = 64;// width/height ratio is 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

// pipeimages
let topPipeImg;
let bottomPipeImg;



//physics
let velocityX = -2;
let gravity = 0.4;
let velocityY = 0;


let gameOver = false;
let score = 0;


window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); // usesd for drawing the board

  // draw the flappy bird
  // context.fillStyle="transparent";
  // context.fillRect(bird.x, bird.y, bird.width, bird.height);

  // load the bird images
  birdImg = new Image();
  birdImg.src = "Images/flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  }

  topPipeImg = new Image();
  topPipeImg.src = "Images/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "Images/bottompipe.png"

  requestAnimationFrame(update);
  // add the pipes
  setInterval(placePipes, 1500);
  document.addEventListener("keydown", movebird);


}
function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);
  // drawing the bird
  velocityY += gravity;
  // bird.y+=velocityY;

  bird.y = Math.max(bird.y + velocityY, 0) // for limiting the bird
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }

  //pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);



    if (collisionDetection(bird, pipe)) {
      gameOver = true;
    }
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5; // as dur=e to 2 pipes the score will get updated by 2  
      pipe.passed = true;
    }

  }


  // scores
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    context.fillText("GAME OVER", 5, 90);
  }

  while (pipeArraylength > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();// remeoves the first element of the array which is paased
  }


}

function placePipes() {
  if (gameOver) {
    return;
  }
  let randompipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let opening = board.height / 4;

  let toppipe = {


    img: topPipeImg,
    x: pipeX,
    y: randompipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false

  }
  pipeArray.push(toppipe);

  let bottompipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randompipeY + pipeHeight + opening,
    width: pipeWidth,
    height: pipeHeight,
    passed: false
  }
  pipeArray.push(bottompipe);

}
function movebird(e) {
  if (e.key === "ArrowUp" || e.code === "Space" || e.key === "KeyX") {
    // jump flappy bird
    velocityY = -6;


  }
  // RESET THE GAME
  if (gameOver) {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    gameOver = false;
  }

}

// collision detection
function collisionDetection(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}