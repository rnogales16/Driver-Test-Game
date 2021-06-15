const leftImg = document.createElement('img');
leftImg.src = './images/left-road-image.png';

const rightImg = document.createElement('img');
rightImg.src = './images/right-road-image.png';

class fotoizquierda {
	constructor(canvasContext, positionX, imagen, speed) {
		(this.ctx = canvasContext),
		(this.x = positionX),
		(this.y = 0),
		(this.width = 400),
		(this.height = 2000),
    (this.image = imagen),
		(this.speed = speed);
	}

	draw() {
		this.ctx.drawImage(leftImg, this.x, this.y, this.width, this.height);
	}

	move() {
		this.y += this.speed;
	}
}

class fotoderecha {
	constructor(canvasContext, positionX, imagen, speed) {
		(this.ctx = canvasContext),
		(this.x = positionX),
		(this.y = 0),
		(this.width = 400),
		(this.height = 2000),
    (this.image = imagen),
		(this.speed = speed);
	}

	draw() {
		this.ctx.drawImage(rightImg, this.x, this.y, this.width, this.height);
	}

	move() {
		this.y += this.speed;
	}
}