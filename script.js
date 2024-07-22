const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas width and height
canvas.width = 800;
canvas.height = 400;

// Define game variables
let gameSpeed = 2;
let gravity = 1.5;
let score = 0;
let gameOver = false;
let animationId;
let spacePressed = false;

// Load images
const backgroundImage = new Image();
const dinoImage = new Image();
const obstacleImage = new Image();

backgroundImage.src = "./assets/hell.jpg";
dinoImage.src = "./assets/mario.png";
obstacleImage.src = "./assets/obstacle.png";

let dino = {
  x: 50,
  y: canvas.height - 40,
  width: 30,
  height: 30,
  jumping: false,
  jumpHeight: 150,
};

let obstacles = [];

function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background image
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // Draw ground
  ctx.fillStyle = "#ccc";
  ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

  // Draw Dino if not game over
  if (!gameOver) {
    ctx.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);
  }

  // Draw obstacles
  obstacles.forEach((obstacle) => {
    ctx.drawImage(
      obstacleImage,
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height
    );
  });

  // Draw score
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Score: " + score.toFixed(1), 10, 20);

  // Draw Game Over message
  if (gameOver) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
  }
}

function update() {
  const groundLevel = canvas.height - 20;

  if (dino.jumping) {
    dino.y -= gravity;
    if (dino.y <= groundLevel - dino.jumpHeight) {
      dino.jumping = false;
    }
  } else {
    dino.y += gravity;
    if (dino.y >= groundLevel - dino.height) {
      dino.y = groundLevel - dino.height;
    }
  }

  obstacles.forEach((obstacle) => {
    obstacle.x -= gameSpeed;
  });

  obstacles.forEach((obstacle) => {
    if (
      dino.x < obstacle.x + obstacle.width &&
      dino.x + dino.width > obstacle.x &&
      dino.y + dino.height > obstacle.y &&
      dino.y < obstacle.y + obstacle.height
    ) {
      gameOver = true;
      cancelAnimationFrame(animationId);
    }
  });

  obstacles = obstacles.filter((obstacle) => {
    if (obstacle.x + obstacle.width < 0) {
      return false;
    }
    return true;
  });

  if (Math.random() < 0.02) {
    const cactusHeight = 40 + Math.random() * 50;
    const cactusWidth = 15 + Math.random() * 20;
    obstacles.push({
      x: canvas.width,
      y: canvas.height - cactusHeight - 20,
      width: cactusWidth,
      height: cactusHeight,
    });
  }

  // Increase score slower (adjust increment value)
  if (!gameOver) {
    score += 0.1; // Increment score by 0.1 each frame
  }
}

function handleKeyDown(event) {
  if (event.code === "Space" && !dino.jumping && !gameOver) {
    if (!spacePressed) {
      dino.jumping = true;
      spacePressed = true;
    }
  } else if (event.code === "Enter" && gameOver) {
    resetGame();
  }
}

function handleKeyUp(event) {
  if (event.code === "Space") {
    spacePressed = false;
  }
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

function resetGame() {
  gameOver = false;
  score = 0;
  obstacles = [];
  dino.y = canvas.height - 40;
  dino.jumping = false;

  startGame();
}

function gameLoop() {
  update();

  if (!gameOver) {
    draw();
    animationId = requestAnimationFrame(gameLoop);
  } else {
    draw();
  }
}

function startGame() {
  if (
    backgroundImage.complete &&
    dinoImage.complete &&
    obstacleImage.complete
  ) {
    gameLoop();
  } else {
    setTimeout(startGame, 100);
  }
}

startGame();
