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
		console.log('hola');
		ctx.clearRect(0, 0, 800, 500);
		rightImage.move();
		leftImage.move()
		leftImage.draw();
		rightImage.draw();
		leftBall.draw();
		rightBall.draw();

		rightImage.push
	}
	console.log(gameLoop);
	
	document.getElementById('button').onclick = () => {
		gameLoop();
	};
	
	
	window.addEventListener('keydown', moveBalls);
	
	function moveBalls(event){
		/*if (left == true) {
			x -= 15
		}
		if (right == true){
			x += 15
		}

		public void keyPressed() {
			if (key == 'a') left = true;
			if (key == 'd') right = true;
			if (key == 37) left = true;
			if (key == 39) right = true;
		}

		public void keyReleased() {
			if (key == 'a') left = false;
			if (key == 'd') right = false;
			if (key == 37) left = false;
			if (key == 39) right = false;
		}
		*/
		
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