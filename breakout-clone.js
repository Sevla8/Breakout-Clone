var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var paddleHeigth = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var paddleY = canvas.height-paddleHeigth;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeigth = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var gameOver = document.querySelector(".gameOver");
var score = 0;
var lives = 3;

var bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
	bricks[c] = [];
	for (let r = 0; r < brickRowCount; r += 1)
		bricks[c][r] = { x: 0, y: 0, status: 1 };
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(event) {
	if (event.keyCode == 39)
		rightPressed = true;
	else if (event.keyCode == 37)
		leftPressed = true;
}

function keyUpHandler(event) {
	if (event.keyCode == 39)
		rightPressed = false;
	else if (event.keyCode == 37)
		leftPressed = false;
}

function mouseMoveHandler(event) {
	let relativeX = event.clientX - canvas.offsetLeft
	if (relativeX > 0 && relativeX < canvas.width)
		paddleX = relativeX -paddleWidth/2;
}

function collisionDetection() {
	for (let c = 0; c < brickColumnCount; c += 1) {
		for (let r = 0; r < brickRowCount; r += 1) {
			let b = bricks[c][r];
			if (b.status == 1) {
				if (x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeigth) {
					dy = -dy;
					b.status = 0;
					score += 1;
					if (score == brickRowCount*brickColumnCount) {
						alert("YOU WIN, CONGRATULATIONS");
						document.location.reload();
					}
				}
			}
		}
	}
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
	ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width-65, 20);
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, paddleY, paddleWidth, paddleHeigth)
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();	
}

function drawBricks() {
	for (let c = 0; c < brickColumnCount; c += 1) {
		for (let r = 0; r < brickRowCount; r += 1) {
			if (bricks[c][r].status == 1) {
				let brickX = c * (brickWidth+brickPadding) + brickOffsetLeft;
				let brickY = r * (brickHeigth+brickPadding) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeigth);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();
	collisionDetection();
	if (x+dx < ballRadius || x+dx > canvas.width-ballRadius)
		dx = -dx;
	if (y+dy < ballRadius)
		dy = -dy;
	else if  (y+dy > canvas.height-ballRadius) {
		if (x > paddleX && x < paddleX+paddleWidth)
			dy = -dy;
		else {
			lives -= 1;
			if (!lives) {
				alert("GAME OVER");
				document.location.reload();
			}
			else {
				x = canvas.width/2;
				y = canvas.height - 30;
				dx = 2;
				dy = -2;
				paddleX = (canvas.width-paddleWidth)/2;
			}
		}
	}
	if (rightPressed && paddleX < canvas.width-paddleWidth)
		paddleX += 7;
	if (leftPressed && paddleX > 0)
		paddleX -= 7;
	x += dx;
	y += dy;
	requestAnimationFrame(draw);
}

draw();
