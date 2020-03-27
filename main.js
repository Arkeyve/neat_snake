var snakes = [];
var deadSnakes = [];
window.snakeMaxGenScores = [];
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

    var snakesPerGen = 2000;
    var maxGen = 20000;
    var currentGen = 1;

    var genScores = [];
    var genRange = [0, 0];

    var loop;

    function newGeneration() {
        deadSnakes = deadSnakes.sort((a, b) => (a.score > b.score) ? 1 : -1).reverse();
        console.log("Generation " + currentGen + "/" + maxGen + ": ");
        if(deadSnakes[0]) {
            console.log("Max Score: " + deadSnakes[0].score);
            console.log("Max Survival Time: " + deadSnakes[0].survivalTime);
            console.log("Max Length: " + (deadSnakes[0].snakeBody.length - 1));
            genScores.push(deadSnakes[0].score);
            genRange[0] = Math.min(...genScores);
            genRange[1] = Math.max(...genScores);
            window.updateLineCtx(genRange[1], currentGen);
        }
        console.log(genRange);
        // console.log(deadSnakes[0]);
        console.log("Going to next generation: " + Math.floor(snakesPerGen / 3));
        startGame();
        loop = setInterval(draw, 1);
    }

    function startGame() {
        let i = 0;
        snakes = [];
        if(deadSnakes.length > 0) {
            for(; i < Math.floor(snakesPerGen / 3); i++) {
                // console.log("deadSnakes[i]: " + deadSnakes[i].score);
                snakes.push(new Snake([xCells, yCells, deadSnakes[i]]));
            }
        }
        deadSnakes = [];
        for(; i < snakesPerGen; i++) {
            snakes.push(new Snake([xCells, yCells]));
        }
        // console.log(snakes[0]);
        document.getElementById('currentGen').value = currentGen;
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

            ctx.fillStyle = "hsla(" + ((snakes[snake].getScore() / genRange[1]) * 255) + ", 100%, 40%, 0.5)";
            // ctx.fillStyle = "hsla(255, 100%, 100%, 0.5)";
            for(i in snakes[snake].snakeBody) {
                ctx.fillRect(snakes[snake].snakeBody[i].x * unit, snakes[snake].snakeBody[i].y * unit, unit, unit);
            }
            snakes[snake].moveSnake();
            var collisionType = snakes[snake].collision();
            if(collisionType === "S") {
                snakes[snake].getScore();
                deadSnakes.push(snakes[snake]);
                // stopGame(snakes[snake]);
                snakes[snake].kill();
                snakes.splice(snake, 1);
            } else if(collisionType === "A") {
                snakes[snake].resetApple();
            }
            if(snakes[snake]) {
                snakes[snake].decideNextMove();
            }
        }

        let snake = deadSnakes.length - 1;
        ctx.fillStyle = "hsla(255, 100%, 100%, 0.5)";
        for(i in deadSnakes[snake].snakeBody) {
            if(i !== 0) {
                ctx.fillRect(deadSnakes[snake].snakeBody[i].x * unit, deadSnakes[snake].snakeBody[i].y * unit, unit, unit);
            }
        }

        if(snakes.length === 0) {
            clearInterval(loop);
            if(currentGen < maxGen) {
                newGeneration();
                currentGen++;
                document.getElementById('currentGen').value = currentGen;
                // new generation
            }
        }
    }

    window.loadLineCtx();
    newGeneration();
};
