const leftBallImg = document.createElement("img");
leftBallImg.src = "./images/Circulo_verde.png";

const rightBallImg = document.createElement("img");
rightBallImg.src = "./images/Circulo_verde.png";

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let beepOscillator = null;

function startBeep() {
  if (beepOscillator) return;
  beepOscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  beepOscillator.type = "sine";
  beepOscillator.frequency.value = 600;
  gain.gain.value = 0.15;
  beepOscillator.connect(gain);
  gain.connect(audioCtx.destination);
  beepOscillator.start();
}

function stopBeep() {
  if (!beepOscillator) return;
  beepOscillator.stop();
  beepOscillator = null;
}

let offRoadCount = 0;

class Ball {
  constructor(canvasContext, positionX, image) {
    this.ctx = canvasContext;
    this.x = positionX;
    this.y = 90;
    this.width = 70;
    this.height = 70;
    this.image = image;
    this.lives = 2500;
    this.onRoad = true;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  checkPosition() {
    const wasOnRoad = this.onRoad;
    this.onRoad = isOnRoad(this.ctx, this.x, this.y, this.width);

    if (!this.onRoad) {
      this.lives -= 1;
      if (wasOnRoad) {
        offRoadCount++;
        startBeep();
      }
    } else if (wasOnRoad === false) {
      offRoadCount = Math.max(0, offRoadCount - 1);
      if (offRoadCount === 0) stopBeep();
    }
  }
}
