window.onload = () => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  const leftRoad = new Road(ctx, leftRoadImg, 0);
  const rightRoad = new Road(ctx, rightRoadImg, 400);

  const leftBall = new Ball(ctx, 160, leftBallImg);
  const rightBall = new Ball(ctx, 568, rightBallImg);

  const chronometer = new Chronometer();

  let frameId = null;
  let paused = false;
  let gameStarted = false;
  let gameOver = false;
  const MOVE_STEP = 15;
  const SPEED_INCREMENT = 0.3;
  const SPEED_INTERVAL_SEC = 15;

  // DOM elements
  const livesEl = document.getElementById("lives");
  const speedEl = document.getElementById("speed");
  const highscoreEl = document.getElementById("highscore");
  const minDecEl = document.getElementById("minDec");
  const minUniEl = document.getElementById("minUni");
  const secDecEl = document.getElementById("secDec");
  const secUniEl = document.getElementById("secUni");
  const startBtn = document.getElementById("button");
  const overlay = document.getElementById("gameover-overlay");
  const finalTimeEl = document.getElementById("final-time");
  const finalSpeedEl = document.getElementById("final-speed");
  const newRecordEl = document.getElementById("new-record");
  const restartBtn = document.getElementById("restart-btn");

  // Load high score
  const savedHighScore = localStorage.getItem("drivertest-highscore");
  if (savedHighScore) {
    highscoreEl.innerText = savedHighScore;
  }

  let currentSpeed = 1;
  let timerIntervalId = null;

  function gameLoop() {
    if (paused || gameOver) return;
    frameId = requestAnimationFrame(gameLoop);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    leftRoad.move();
    leftRoad.draw();
    rightRoad.move();
    rightRoad.draw();

    leftBall.draw();
    rightBall.draw();
    leftBall.checkPosition();
    rightBall.checkPosition();

    updateUI();
    checkSpeedUp();
    checkGameOver();
  }

  function updateUI() {
    livesEl.innerText = leftBall.lives + rightBall.lives;
  }

  function updateTimer() {
    const min = chronometer.computeTwoDigitNumber(chronometer.getMinutes());
    const sec = chronometer.computeTwoDigitNumber(chronometer.getSeconds());
    minDecEl.innerText = min[0];
    minUniEl.innerText = min[1];
    secDecEl.innerText = sec[0];
    secUniEl.innerText = sec[1];
  }

  function checkSpeedUp() {
    const elapsed = chronometer.currentTime;
    const expectedSpeed = 1 + Math.floor(elapsed / SPEED_INTERVAL_SEC) * SPEED_INCREMENT;
    if (expectedSpeed !== currentSpeed) {
      currentSpeed = expectedSpeed;
      leftRoad.setSpeed(currentSpeed);
      rightRoad.setSpeed(currentSpeed);
      speedEl.innerText = currentSpeed.toFixed(1) + "x";
    }
  }

  function checkGameOver() {
    const totalLives = leftBall.lives + rightBall.lives;
    if (totalLives <= 0) {
      gameOver = true;
      cancelAnimationFrame(frameId);
      chronometer.stop();
      clearInterval(timerIntervalId);
      showGameOver();
    }
  }

  function showGameOver() {
    const timeStr = chronometer.getTimeString();
    finalTimeEl.innerText = timeStr;
    finalSpeedEl.innerText = currentSpeed.toFixed(1) + "x";

    // Check high score (by seconds survived)
    const prevBest = parseInt(localStorage.getItem("drivertest-highscore-sec") || "0");
    const current = chronometer.currentTime;
    if (current > prevBest) {
      localStorage.setItem("drivertest-highscore-sec", current);
      localStorage.setItem("drivertest-highscore", timeStr);
      highscoreEl.innerText = timeStr;
      newRecordEl.classList.remove("hidden");
    } else {
      newRecordEl.classList.add("hidden");
    }

    overlay.classList.remove("hidden");
  }

  function resetGame() {
    overlay.classList.add("hidden");
    gameOver = false;
    paused = false;
    gameStarted = false;
    currentSpeed = 1;

    leftBall.lives = 500;
    rightBall.lives = 500;
    leftBall.x = 160;
    rightBall.x = 568;
    leftRoad.setSpeed(1);
    rightRoad.setSpeed(1);
    leftRoad.y = 0;
    rightRoad.y = 0;

    chronometer.reset();
    livesEl.innerText = "1000";
    speedEl.innerText = "1x";
    updateTimer();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    startBtn.style.display = "";
  }

  function togglePause() {
    if (!gameStarted || gameOver) return;
    paused = !paused;
    if (paused) {
      chronometer.stop();
      clearInterval(timerIntervalId);
      // Draw pause text
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "bold 60px Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("PAUSA", canvas.width / 2, canvas.height / 2);
    } else {
      chronometer.start();
      timerIntervalId = setInterval(updateTimer, 1000);
      gameLoop();
    }
  }

  // Start game
  startBtn.addEventListener("click", () => {
    if (gameStarted) return;
    gameStarted = true;
    startBtn.style.display = "none";
    chronometer.start();
    timerIntervalId = setInterval(updateTimer, 1000);
    gameLoop();
  });

  restartBtn.addEventListener("click", () => {
    resetGame();
  });

  // Keyboard controls
  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      togglePause();
      return;
    }

    if (paused || !gameStarted || gameOver) return;

    switch (event.key) {
      case "a":
      case "A":
        if (leftBall.x > 0) leftBall.x -= MOVE_STEP;
        break;
      case "d":
      case "D":
        if (leftBall.x < canvas.width - leftBall.width) leftBall.x += MOVE_STEP;
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (rightBall.x > 0) rightBall.x -= MOVE_STEP;
        break;
      case "ArrowRight":
        event.preventDefault();
        if (rightBall.x < canvas.width - rightBall.width) rightBall.x += MOVE_STEP;
        break;
    }
  });
};
