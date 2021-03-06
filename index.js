window.onload = () => {

	const canvas = document.querySelector('canvas');
	const ctx = canvas.getContext('2d');
	let frameId = null;

	
	const leftImage = new fotoizquierda(ctx);
	const rightImage = new fotoderecha(ctx);
	
	const leftBall = new bolaizquierda(ctx, 160);
	const rightBall = new boladerecha(ctx, 568);
	
	console.log(leftBall);


	function gameLoop() {
		frameId = requestAnimationFrame(gameLoop);
		ctx.clearRect(0, 0, 800, 500);
		rightImage.move();
		rightImage.draw();
		leftImage.move()
		leftImage.draw();
		leftBall.draw();
		rightBall.draw();
		leftBall.position();
		rightBall.position();
		printLives();
		checkGameOver();
	}
	console.log(gameLoop);
	
	document.getElementById('button').onclick = () => {
		gameLoop();
		chronometer.start();
  	printTime();
	};
	
	const livesElements = document.getElementById('lives')

	function printLives() {
		livesElements.innerText = leftBall.lives + rightBall.lives;
	}

	function checkGameOver() {
		if (leftBall.lives + rightBall.lives <= 0){
			cancelAnimationFrame(frameId);
			alert('Game Over!')
			window.location.reload();
		}
	}


	const chronometer = new Chronometer();

	const minDecElement = document.getElementById('minDec');
	const minUniElement = document.getElementById('minUni');
	const secDecElement = document.getElementById('secDec');
	const secUniElement = document.getElementById('secUni');

	function printTime() {
		setInterval(() => {
			const seconds = printSeconds();
			const minutes = printMinutes();
	
			console.log('tick', minutes, seconds);
	
			minDecElement.innerText = minutes[0];
			minUniElement.innerText = minutes[1];
			secDecElement.innerText = seconds[0];
			secUniElement.innerText = seconds[1];
		}, 1000);
		
	}
	function printMinutes() {
		return chronometer.computeTwoDigitNumber(chronometer.getMinutes());
	}
	
	function printSeconds() {
		return chronometer.computeTwoDigitNumber(chronometer.getSeconds());
	}

	
	window.addEventListener('keydown', moveBalls);
	
	function moveBalls(event){
		switch (event.keyCode) {
			case 65:
				if (leftBall.x > 0) leftBall.x -= 15;
				console.log(leftBall.x);
				break;

			case 68:
				if (leftBall.x < canvas.width - leftBall.width) leftBall.x += 15;
				console.log(leftBall.x);
				break;

			case 37:
				if (rightBall.x > 0) rightBall.x -= 15;
				console.log(rightBall.x);
				break;

			case 39:
				if (rightBall.x < canvas.width - rightBall.width) rightBall.x += 15;
				console.log(rightBall.x);
				break;

			default:
			break;
		}
	}		
}