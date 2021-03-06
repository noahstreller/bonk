// define canvas
var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");
var score = document.getElementById("score");
var highscore = document.getElementById("highscore");

// define position
let x = Math.floor(Math.random() * canvas.width);
let y = canvas.height - 30;

// game settings
var scoreval = 0;
var gamenum = 1;
var gamePaused = false;
var slowmotion = false;
var gameSpeed = 1;
var highscoreval = document.cookie;

// define directions
let dx = gameSpeed;
let dy = -dx;

// define ball vars
var ballRadius = 10;

// paddle vars
var paddleHeight = 3;
var paddlespeed = 2;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

// bricks vars
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;


// keyboard vars
var rightPressed = false;
var leftPressed = false;

// sets interval
var interval = setInterval(draw, 5);

// draws the ball on the canvas
function drawBall(){

	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#ffffff";
	ctx.fill();
	ctx.closePath();

}

// draws paddle
function drawPaddle(){

	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#bbb";
	ctx.fill();
	ctx.closePath();

}

// draws bricks
function drawBricks(){

	for(var c = 0; c < brickColumnCount; c ++){

		for(var r = 0; r < brickRowCount; r ++){

			if(bricks[c][r].status == 1) {

				var brickX = (c * (brickWidth + brickPadding))+ brickOffsetLeft;
				var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;

				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#555";
				ctx.fill();
				ctx.closePath();

			}

		}

	}

}

// detects, if a brick was hit
function detectColisions(){

	for(var c = 0; c < brickColumnCount; c ++){

		for(var r = 0; r < brickRowCount; r ++){

			var b = bricks[c][r];

			if(b.status == 1){

				if(x + ballRadius > b.x && x < b.x + brickWidth && y + ballRadius > b.y && y - ballRadius < b.y + brickHeight){
					dy = -dy;
					b.status = 0;
					scoreval ++;

					if(scoreval / gamenum == brickRowCount * brickColumnCount) {
						
						setTimeout(()=>{
							
							clearInterval(interval);
							canvas.classList.add("woosh");

							gamenum ++;
							gameSpeed = gameSpeed + (gamenum / 5);
							dx = gameSpeed;
							dy = -dx;
							x = Math.floor(Math.random() * canvas.width);
							y = canvas.height - 30;


							bricks = [];
							for(var columns = 0; columns < brickColumnCount; columns ++){

								bricks[columns] = [];
								for(var rows = 0; rows < brickRowCount; rows ++){bricks[columns][rows] = {x: 0, y: 0, status: 1};}

							}
														
							setTimeout(()=>{
								interval = setInterval(draw, 0);
								canvas.classList.remove("woosh");
							}, 700);

						}, 100);
						
					}

				}

			}

		}

	}

}


// the movements
function draw(){

	// updates score
	score.innerHTML = "Score: " + scoreval;
	highscore.innerHTML = "Highscore: " + highscoreval;

	// clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// draw elements
	drawBall();
	drawPaddle();
	drawBricks();

	// bounce
	if (y + dy < ballRadius){dy = -dy;} 
	else if (y + dy > canvas.height - paddleHeight - ballRadius){

		if(x > paddleX - 15 && x < paddleX + paddleWidth + 15){dy = -dy;}
		else {

			if(highscoreval < scoreval){
				document.cookie = scoreval;
			}

			canvas.classList.add("red");
			setTimeout(()=>{
				clearInterval(interval); 
				document.location.reload();
			}, 200);

		}

	}

	if (x + dx > canvas.width - ballRadius || x + dx < 0){dx = -dx;}

	// paddle movement
	if (rightPressed){paddleX += paddlespeed;}
	else if (leftPressed){paddleX -= paddlespeed;}

	if (rightPressed){

		paddleX += paddlespeed;
		if (paddleX + paddleWidth > canvas.width){paddleX = canvas.width - paddleWidth;}

	}
	else if (leftPressed){

		paddleX -= paddlespeed;
		if (paddleX < 0){paddleX = 0;}

	}

	detectColisions();

	// passive movement
	x += dx;
	y += dy;

}


// handle keys and mouse
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("click", pauseGame, false);

function keyDownHandler(e){

	if (e.key == "Right" || e.key == "ArrowRight"){rightPressed = true;}
	else if (e.key == "Left" || e.key == "ArrowLeft"){leftPressed = true;}
	else if (e.code == "Space" || e.code == "Spacebar"){slowMotion();}

}

function keyUpHandler(e){

	if (e.key == "Right" || e.key == "ArrowRight"){rightPressed = false;}
	else if (e.key == "Left" || e.key == "ArrowLeft"){leftPressed = false;}
	else if (e.key == "Esc" || e.key == "Escape"){pauseGame();}
	else if (e.code == "Space" || e.code == "Spacebar"){stopSlowMotion();}

}

function mouseMoveHandler(e){

	var relativeX = e.clientX - canvas.offsetLeft;
	if(relativeX > 0 && relativeX < canvas.width) {paddleX = relativeX - paddleWidth/2;}

}

function pauseGame(){

	if(gamePaused == true){

		interval = setInterval(draw, 5);
		gamePaused = false;
		canvas.classList.remove("paused");

	}
	else {

		clearInterval(interval);
		gamePaused = true;
		canvas.classList.add("paused");

	}

}

function slowMotion(){

	if(slowmotion){return;}
	slowmotion = true;

	clearInterval(interval);
	interval = setInterval(draw, 20);
	scoreval -= 10;

	setTimeout(function(){return}, 1000);

}

function stopSlowMotion(){

	clearInterval(interval);
	interval = setInterval(draw, 5);
	slowmotion = false;

}

var bricks = [];
for(var columns = 0; columns < brickColumnCount; columns ++){

	bricks[columns] = [];
	for(var rows = 0; rows < brickRowCount; rows ++){bricks[columns][rows] = {x: 0, y: 0, status: 1};}

}