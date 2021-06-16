const leftImg = document.createElement('img');
leftImg.src = './images/left-road-image.png';

const rightImg = document.createElement('img');
rightImg.src = './images/right-road-image.png';

class fotoizquierda {
	constructor(canvasContext, startPositionX=0, speed=1) {
		(this.ctx = canvasContext),
		(this.x = startPositionX),
		(this.y = 0),
		(this.width = 400),
		(this.height = 2000),
		(this.speed = speed);
	}

	draw() {
		this.ctx.drawImage(leftImg, this.x, this.y, this.width, this.height);
		this.ctx.drawImage(leftImg, this.x, this.y + this.height, this.width, this.height);
	}

	move() {
		this.y -= this.speed;
		if (this.y < -this.height) this.y = 0
	}
}

class fotoderecha {
	constructor(canvasContext, startPositionX=400, speed=1) {
		(this.ctx = canvasContext),
		(this.x = startPositionX),
		(this.y = 0),
		(this.width = 400),
		(this.height = 2000),
		(this.speed = speed);
	}

	draw() {
		this.ctx.drawImage(rightImg, this.x, this.y, this.width, this.height);
		this.ctx.drawImage(rightImg, this.x, this.y + this.height, this.width, this.height);
	}

	move() {
		this.y -= this.speed;
		if (this.y < -this.height) this.y = 0
	}
}