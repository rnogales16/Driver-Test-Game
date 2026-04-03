window.onload = () => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  const leftRoad = new Road(ctx, leftRoadImg, 0);
  const rightRoad = new Road(ctx, rightRoadImg, 400);

  const leftBall = new Ball(ctx, 160, leftBallImg);
  const rightBall = new Ball(ctx, 568, rightBallImg);

  leftBall.width = 60;
  leftBall.height = 60;
  rightBall.width = 60;
  rightBall.height = 60;

  const chronometer = new Chronometer();

  let frameId = null;
  let paused = false;
  let gameStarted = false;
  let gameOver = false;
  let gameMode = "progressive";
  const MOVE_STEP = 2.5;
  const SPEED_INCREMENT = 0.3;
  const SPEED_INTERVAL_SEC = 15;

  // Stats tracking
  let totalFrames = 0;
  let framesOnRoad = 0;
  let currentStreak = 0;
  let bestStreak = 0;
  const GRACE_FRAMES = 120; // ~2 seconds at 60fps

  // DOM elements
  const livesEl = document.getElementById("lives");
  const speedEl = document.getElementById("speed");
  const highscoreEl = document.getElementById("highscore");
  const minDecEl = document.getElementById("minDec");
  const minUniEl = document.getElementById("minUni");
  const secDecEl = document.getElementById("secDec");
  const secUniEl = document.getElementById("secUni");
  const startBtn = document.getElementById("button");
  const canvasStart = document.getElementById("canvas-start");
  const canvasGameover = document.getElementById("canvas-gameover");
  const finalTimeEl = document.getElementById("final-time");
  const finalSpeedEl = document.getElementById("final-speed");
  const finalAccuracyEl = document.getElementById("final-accuracy");
  const finalStreakEl = document.getElementById("final-streak");
  const newRecordEl = document.getElementById("new-record");
  const restartBtn = document.getElementById("restart-btn");
  const modeProgressiveBtn = document.getElementById("mode-progressive");
  const modeConstantBtn = document.getElementById("mode-constant");
  const modeDescEl = document.getElementById("mode-desc");
  const touchControls = document.getElementById("touch-controls");

  // Detect mobile and show touch controls
  const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (isMobile && touchControls) {
    touchControls.classList.remove("hidden");
  }

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
    modeDescEl.innerText = "La velocidad aumenta cada 15 segundos";
    loadHighScore();
  });

  modeConstantBtn.addEventListener("click", () => {
    if (gameStarted) return;
    gameMode = "constant";
    modeConstantBtn.classList.add("active");
    modeProgressiveBtn.classList.remove("active");
    modeDescEl.innerText = "Velocidad constante durante toda la partida";
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

  // Touch controls
  if (touchControls) {
    const touchBtns = touchControls.querySelectorAll(".touch-btn");
    touchBtns.forEach((btn) => {
      const ball = btn.dataset.ball;
      const dir = btn.dataset.dir;
      let touchInterval = null;

      function startMove() {
        if (!gameStarted || paused || gameOver) return;
        doMove();
        touchInterval = setInterval(doMove, 30);
      }

      function stopMove() {
        clearInterval(touchInterval);
        touchInterval = null;
      }

      function doMove() {
        if (ball === "left" && dir === "left") {
          if (leftBall.x - MOVE_STEP >= 0) leftBall.x -= MOVE_STEP;
        } else if (ball === "left" && dir === "right") {
          if (leftBall.x + MOVE_STEP <= 343) leftBall.x += MOVE_STEP;
        } else if (ball === "right" && dir === "left") {
          if (rightBall.x - MOVE_STEP >= 402) rightBall.x -= MOVE_STEP;
        } else if (ball === "right" && dir === "right") {
          if (rightBall.x + MOVE_STEP <= canvas.width - rightBall.width) rightBall.x += MOVE_STEP;
        }
      }

      btn.addEventListener("touchstart", (e) => { e.preventDefault(); startMove(); });
      btn.addEventListener("touchend", stopMove);
      btn.addEventListener("touchcancel", stopMove);
      btn.addEventListener("mousedown", startMove);
      btn.addEventListener("mouseup", stopMove);
      btn.addEventListener("mouseleave", stopMove);
    });
  }

  function gameLoop() {
    if (paused || gameOver) return;
    frameId = requestAnimationFrame(gameLoop);

    moveBalls();
    ctx.fillStyle = "#0a0a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    leftRoad.move();
    leftRoad.draw();
    rightRoad.move();
    rightRoad.draw();

    if (totalFrames >= GRACE_FRAMES) {
      leftBall.checkPosition();
      rightBall.checkPosition();
    }
    leftBall.draw();
    rightBall.draw();

    totalFrames++;
    const bothOnRoad = leftBall.onRoad && rightBall.onRoad;
    if (bothOnRoad) {
      framesOnRoad++;
      currentStreak++;
      if (currentStreak > bestStreak) bestStreak = currentStreak;
    } else {
      currentStreak = 0;
    }

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

    const accuracy = totalFrames > 0 ? Math.round((framesOnRoad / totalFrames) * 100) : 0;
    finalAccuracyEl.innerText = accuracy + "%";

    const streakSec = (bestStreak / 60).toFixed(1);
    finalStreakEl.innerText = streakSec + "s";

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

    // Show results section, scroll to it
    canvasGameover.classList.remove("hidden");
  }

  function resetGame() {
    canvasGameover.classList.add("hidden");
    canvasStart.classList.remove("hidden");
    gameOver = false;
    paused = false;
    gameStarted = false;
    currentSpeed = 1;

    leftBall.lives = 2500;
    rightBall.lives = 2500;
    leftBall.x = 160;
    rightBall.x = 568;
    leftRoad.setSpeed(1);
    rightRoad.setSpeed(1);
    leftRoad.y = 0;
    rightRoad.y = 0;

    totalFrames = 0;
    framesOnRoad = 0;
    currentStreak = 0;
    bestStreak = 0;

    chronometer.reset();
    livesEl.innerText = "5000";
    speedEl.innerText = "1x";
    updateTimer();

    ctx.fillStyle = "#0a0a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    loadHighScore();

    // Reset submit score form
    document.getElementById("submit-score-btn").disabled = false;
    document.getElementById("submit-score-btn").style.display = "";
    document.getElementById("score-submitted").classList.add("hidden");

    canvas.scrollIntoView({ behavior: "smooth", block: "center" });
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

  // Start / Pause button
  startBtn.addEventListener("click", () => {
    if (!gameStarted) {
      gameStarted = true;
      canvasStart.classList.add("hidden");
      canvasGameover.classList.add("hidden");
      if (typeof audioCtx !== "undefined" && audioCtx.state === "suspended") audioCtx.resume();
      chronometer.start();
      timerIntervalId = setInterval(updateTimer, 1000);
      canvas.scrollIntoView({ behavior: "smooth", block: "center" });
      gameLoop();
    }
  });

  restartBtn.addEventListener("click", () => {
    resetGame();
  });

  // Submit score to leaderboard
  const submitScoreBtn = document.getElementById("submit-score-btn");
  const playerNameInput = document.getElementById("player-name");
  const scoreSubmittedEl = document.getElementById("score-submitted");

  submitScoreBtn.addEventListener("click", async () => {
    const name = playerNameInput.value.trim();
    if (!name) {
      playerNameInput.focus();
      return;
    }
    submitScoreBtn.disabled = true;
    const accuracy = totalFrames > 0 ? Math.round((framesOnRoad / totalFrames) * 100) : 0;
    await submitScore(name, chronometer.currentTime, chronometer.getTimeString(), gameMode, accuracy);
    scoreSubmittedEl.classList.remove("hidden");
    submitScoreBtn.style.display = "none";
    localStorage.setItem("drivertest-playername", name);
  });

  const savedName = localStorage.getItem("drivertest-playername");
  if (savedName) playerNameInput.value = savedName;

  // Leaderboard tabs
  const lbTabs = document.querySelectorAll(".lb-tab");
  lbTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      lbTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      document.querySelectorAll(".lb-panel").forEach((p) => p.classList.add("hidden"));
      document.getElementById("lb-panel-" + tab.dataset.mode).classList.remove("hidden");
    });
  });

  initLeaderboard();

  // Fullscreen
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const gameArea = document.getElementById("game-area");

  fullscreenBtn.addEventListener("click", () => {
    if (gameArea.requestFullscreen) {
      gameArea.requestFullscreen();
    } else if (gameArea.webkitRequestFullscreen) {
      gameArea.webkitRequestFullscreen();
    }
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
