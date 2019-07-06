var snakes = [];
var deadSnakes = [];
window.onload = function() {
    var iter = 0;
    var itermax;
    var scores = [];

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var unit = 10;
    var xCells = canvas.width / unit;
    var yCells = canvas.height / unit;

    var apple;
    var direction = "R";
    var scoreboard = document.getElementById("score");

    // document.addEventListener("keydown", function(e) {
    //     var dir = e.keyCode;
    //     if(dir === 37 && snakes[0].direction != "R") {
    //         snakes[0].direction = "L";
    //     } else if(dir === 38 && snakes[0].direction != "D") {
    //         snakes[0].direction = "U";
    //     } else if(dir === 39 && snakes[0].direction != "L") {
    //         snakes[0].direction = "R";
    //     } else if(dir === 40 && snakes[0].direction != "U") {
    //         snakes[0].direction = "D";
    //     }
    // });

    function startGame() {
        for(let i = 0; i < 10; i++) {
            snakes.push(new Snake(xCells, yCells));
        }
    }

    function stopGame(snake) {
        //clearInterval(loop);
        setInterval(function() {
            ctx.fillStyle = "#f00";
            ctx.fillRect(snake.snakeBody[1].x * unit, snake.snakeBody[1].y * unit, unit, unit);
            setTimeout(function() {
                ctx.fillStyle = "#fff";
                ctx.fillRect(snake.snakeBody[1].x * unit, snake.snakeBody[1].y * unit, unit, unit);
            }, 200);
        }, 300);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for(let snake = 0; snake < snakes.length; snake++) {
            ctx.fillStyle = "#f00";
            ctx.fillRect(snakes[snake].apple.x * unit, snakes[snake].apple.y * unit, unit, unit);

            ctx.fillStyle = "#ffffffaa";

            for(i in snakes[snake].snakeBody) {
                ctx.fillRect(snakes[snake].snakeBody[i].x * unit, snakes[snake].snakeBody[i].y * unit, unit, unit);
            }
            snakes[snake].moveSnake();
            var collisionType = snakes[snake].collision();
            if(collisionType === "S") {
                snakes[snake].getScore();
                deadSnakes.push(snakes[snake]);
                stopGame(snakes[snake]);
                snakes[snake].kill();
                snakes.splice(snake, 1);
            } else if(collisionType === "A") {
                snakes[snake].resetApple();
            }
            if(snakes[snake]) {
                snakes[snake].decideNextMove();
            }
        }
        for(let snake = 0; snake < deadSnakes.length; snake++) {
            for(i in deadSnakes[snake].snakeBody) {
                ctx.fillRect(deadSnakes[snake].snakeBody[i].x * unit, deadSnakes[snake].snakeBody[i].y * unit, unit, unit);
            }
        }
        if(snakes.length === 0) {
            clearInterval(loop);
        }
    }

    startGame();
    //reset();
    var loop = setInterval(draw, 100);
};
