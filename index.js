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
  let gameMode = "progressive";
  const MOVE_STEP = 2.5;
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

  const modeProgressiveBtn = document.getElementById("mode-progressive");
  const modeConstantBtn = document.getElementById("mode-constant");

  function loadHighScore() {
    const key = "drivertest-highscore-" + gameMode;
    const saved = localStorage.getItem(key);
    highscoreEl.innerText = saved || "--";
  }

  loadHighScore();

  modeProgressiveBtn.addEventListener("click", () => {
    if (gameStarted) return;
    gameMode = "progressive";
    modeProgressiveBtn.classList.add("active");
    modeConstantBtn.classList.remove("active");
    loadHighScore();
  });

  modeConstantBtn.addEventListener("click", () => {
    if (gameStarted) return;
    gameMode = "constant";
    modeConstantBtn.classList.add("active");
    modeProgressiveBtn.classList.remove("active");
    loadHighScore();
  });

  let currentSpeed = 1;
  let timerIntervalId = null;
  const keys = {};

  window.addEventListener("keydown", (e) => { keys[e.key] = true; });
  window.addEventListener("keyup", (e) => { keys[e.key] = false; });

  function moveBalls() {
    if (keys["a"] || keys["A"]) {
      if (leftBall.x - MOVE_STEP >= 0) leftBall.x -= MOVE_STEP;
    }
    if (keys["d"] || keys["D"]) {
      if (leftBall.x + MOVE_STEP <= 343) leftBall.x += MOVE_STEP;
    }
    if (keys["ArrowLeft"]) {
      if (rightBall.x - MOVE_STEP >= 402) rightBall.x -= MOVE_STEP;
    }
    if (keys["ArrowRight"]) {
      if (rightBall.x + MOVE_STEP <= canvas.width - rightBall.width) rightBall.x += MOVE_STEP;
    }
  }

  function gameLoop() {
    if (paused || gameOver) return;
    frameId = requestAnimationFrame(gameLoop);

    moveBalls();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    leftRoad.move();
    leftRoad.draw();
    rightRoad.move();
    rightRoad.draw();

    leftBall.checkPosition();
    rightBall.checkPosition();
    leftBall.draw();
    rightBall.draw();

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
    if (gameMode === "constant") return;
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
      stopBeep();
      showGameOver();
    }
  }

  function showGameOver() {
    const timeStr = chronometer.getTimeString();
    finalTimeEl.innerText = timeStr;
    finalSpeedEl.innerText = currentSpeed.toFixed(1) + "x";

    // Check high score (by seconds survived, per mode)
    const secKey = "drivertest-highscore-sec-" + gameMode;
    const strKey = "drivertest-highscore-" + gameMode;
    const prevBest = parseInt(localStorage.getItem(secKey) || "0");
    const current = chronometer.currentTime;
    if (current > prevBest) {
      localStorage.setItem(secKey, current);
      localStorage.setItem(strKey, timeStr);
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

    leftBall.lives = 5000;
    rightBall.lives = 5000;
    leftBall.x = 160;
    rightBall.x = 568;
    leftRoad.setSpeed(1);
    rightRoad.setSpeed(1);
    leftRoad.y = 0;
    rightRoad.y = 0;

    chronometer.reset();
    livesEl.innerText = "10000";
    speedEl.innerText = "1x";
    updateTimer();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    startBtn.style.display = "";
    document.querySelector(".mode-selector").style.display = "";
    loadHighScore();
  }

  function togglePause() {
    if (!gameStarted || gameOver) return;
    paused = !paused;
    if (paused) {
      chronometer.stop();
      clearInterval(timerIntervalId);
      stopBeep();
      offRoadCount = 0;
      leftBall.onRoad = true;
      rightBall.onRoad = true;
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
    document.querySelector(".mode-selector").style.display = "none";
    chronometer.start();
    timerIntervalId = setInterval(updateTimer, 1000);
    gameLoop();
  });

  restartBtn.addEventListener("click", () => {
    resetGame();
  });

  // Pause and prevent default for arrow keys
  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      togglePause();
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
    }
  });
};
