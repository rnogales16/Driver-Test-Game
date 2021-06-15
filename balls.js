const leftBallImg = document.createElement("img");
leftBallImg.src = "./images/Circulo_verde.png";
console.log(leftBallImg);

const rightBall = document.createElement("img");
rightBall.src = "./images/Circulo_verde.png";

class bolaizquierda {
  constructor(canvasContext, positionX, ball) {
    (this.ctx = canvasContext),
      (this.x = positionX),
      (this.y = 90),
      (this.width = 70),
      (this.height = 70),
      (this.image = ball);
  }

  draw() {
    this.ctx.drawImage(leftBallImg, this.x, this.y, this.width, this.height);
  }
}

class boladerecha {
  constructor(canvasContext, positionX, ball) {
    (this.ctx = canvasContext),
      (this.x = positionX),
      (this.y = 90),
      (this.width = 70),
      (this.height = 70),
      (this.image = ball);
  }

  draw() {
    this.ctx.drawImage(rightBall, this.x, this.y, this.width, this.height);
  }
}
