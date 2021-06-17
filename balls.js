const leftBallImg = document.createElement("img");
leftBallImg.src = "./images/Circulo_verde.png";
console.log(leftBallImg);

const rightBall = document.createElement("img");
rightBall.src = "./images/Circulo_verde.png";

class bolaizquierda {
  constructor(canvasContext, positionX, ball) {
    this.ctx = canvasContext;
    this.x = positionX;
    this.y = 90;
    this.width = 70;
    this.height = 70;
    this.image = ball;
    this.lives = 500;
  }

  draw() {
    this.ctx.drawImage(leftBallImg, this.x, this.y, this.width, this.height);
  }

  position(){
    console.log(this.lives);
    if (!isOnRoad(this.ctx, this.x, this.y, this.width)) {
      this.lives -= 1; //y que suene pitido
    }
  }
}

class boladerecha {
  constructor(canvasContext, positionX, ball) {
    this.ctx = canvasContext;
    this.x = positionX;
    this.y = 90;
    this.width = 70;
    this.height = 70;
    this.image = ball;
    this.lives = 500;
  }

  draw() {
    this.ctx.drawImage(rightBall, this.x, this.y, this.width, this.height);
  }

  position(){
    console.log(this.lives);
    if (!isOnRoad(this.ctx, this.x, this.y, this.width)) {
      this.lives -= 1; //y que suene pitido
    }
  }
}
