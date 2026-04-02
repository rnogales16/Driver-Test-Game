const leftRoadImg = document.createElement("img");
leftRoadImg.src = "./images/left-road-image.svg";

const rightRoadImg = document.createElement("img");
rightRoadImg.src = "./images/right-road-image.svg";

class Road {
  constructor(canvasContext, image, startPositionX = 0, speed = 1) {
    this.ctx = canvasContext;
    this.image = image;
    this.x = startPositionX;
    this.y = 0;
    this.width = 400;
    this.height = 1800;
    this.speed = speed;
  }

  draw() {
    const ry = Math.round(this.y);
    this.ctx.drawImage(this.image, this.x, ry, this.width, this.height);
    this.ctx.drawImage(this.image, this.x, ry + this.height, this.width, this.height);
  }

  move() {
    this.y -= this.speed;
    if (this.y < -this.height) this.y = 0;
  }

  setSpeed(speed) {
    this.speed = speed;
  }
}
