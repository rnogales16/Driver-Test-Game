const leftBallImg = document.createElement("img");
leftBallImg.src = "./images/Circulo_verde.png";

const rightBallImg = document.createElement("img");
rightBallImg.src = "./images/Circulo_verde.png";

const musicBeep = new Audio("./images/beep.mov");

class Ball {
  constructor(canvasContext, positionX, image) {
    this.ctx = canvasContext;
    this.x = positionX;
    this.y = 90;
    this.width = 70;
    this.height = 70;
    this.image = image;
    this.lives = 5000;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  checkPosition() {
    if (!isOnRoad(this.ctx, this.x, this.y, this.width)) {
      this.lives -= 1;
      musicBeep.volume = 0.3;
      musicBeep.play().catch(() => {});
    }
  }
}
