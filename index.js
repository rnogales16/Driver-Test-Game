window.onload = () => {

	const canvas = document.querySelector('canvas');
	const ctx = canvas.getContext('2d');
	let frameId = null;

	
	const leftImage = new fotoizquierda(ctx, 0);
	const rightImage = new fotoderecha(ctx, 400);
	
	const leftBall = new bolaizquierda(ctx, 160);
	const rightBall = new boladerecha(ctx, 568);
	
	console.log(leftBall);


	function gameLoop() {
		frameId = requestAnimationFrame(gameLoop);
		console.log('hola');
		ctx.clearRect(0, 0, 800, 500);
		leftImage.draw();
		rightImage.draw();
		leftBall.draw();
		rightBall.draw();
		rightImage.move();
		leftImage.move()
	}
	console.log(gameLoop);
	
	document.getElementById('button').onclick = () => {
		gameLoop();
	};
	
	
	window.addEventListener('keydown', moveBalls);
	
	function moveBalls(event) {
		switch (event.keyCode) {
			case 65:
				if (leftBall.x > 0) leftBall.x -= 5;
				console.log(leftBall.x);
				break;
				
			case 68:
				if (leftBall.x < canvas.width - leftBall.width) leftBall.x += 5;
				console.log(leftBall.x);
				break;

			case 37:
				if (rightBall.x > 0) rightBall.x -= 5;
				console.log(rightBall.x);
				break;
				
			case 39:
				if (rightBall.x < canvas.width - rightBall.width) rightBall.x += 5;
				console.log(rightBall.x);
				break;
					
			default:
				break;
		}
	}
				
}