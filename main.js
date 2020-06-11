var snakes = [];
var deadSnakes = [];
window.snakeMaxGenScores = [];
window.onload = function() {
    var iter = 0;
    var itermax;
    var scores = [];

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var unit = 100;
    var xCells = canvas.width / unit;
    var yCells = canvas.height / unit;

    var apple;
    var direction = "R";
    var scoreboard = document.getElementById("score");

    var snakesPerGen = 5;
    var maxGen = 20000;
    var currentGen = 1;
    var mutationIntensity = 1;

    var genScores = [];
    var genRange = [0, 0];
    var maxScoreSnake;

    var loop;
    document.getElementById('maxGen').value = maxGen;

    function newGeneration() {
        // deadSnakes = deadSnakes.sort((a, b) => (a.score > b.score) ? 1 : -1).reverse();
        var maxScore = 0;
        for(let i = 0; i < deadSnakes.length; i++) {
            if(deadSnakes[i].score > maxScore) {
                maxScore = deadSnakes[i].score;
                maxScoreSnake = new Snake([xCells, yCells, deadSnakes[i], mutationIntensity]);
            }
        }
        // console.log("Generation " + currentGen + "/" + maxGen + ": ");
        if(maxScoreSnake) {
            // console.log("Max Score: " + maxScoreSnake.score);
            // console.log("Max Survival Time: " + maxScoreSnake.survivalTime);
            // console.log("Max Length: " + (maxScoreSnake.snakeBody.length - 1));
            genScores.push(maxScore);
            genRange[0] = Math.min(...genScores);
            genRange[1] = Math.max(...genScores);
            window.updateLineCtx(maxScore, genRange[1], math.mean(genScores), currentGen);
            if(currentGen % 100 === 0) {
                var outfile_json = {
                    "thetaMatrices": maxScoreSnake.brain.thetaMatrices,
                    "biases": maxScoreSnake.brain.biases
                }
                var file = new Blob([JSON.stringify(outfile_json)], {type: 'text/plain'});
                var a = document.createElement("a");
                var url = URL.createObjectURL(file);
                a.href = url;
                a.download = "output/" + (new Date()).getTime() + "_gen" + currentGen + "_deadSnake0_weights.txt";
                document.body.appendChild(a);
                a.click();
                setTimeout(function() {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        }
        // console.log(genRange);
        // console.log(maxScoreSnake);
        // console.log("Going to next generation: " + Math.floor(snakesPerGen / 3));
        startGame();
        loop = setInterval(draw, 1);
    }

    function startGame() {
        let i = 0;
        snakes = [];
        // mutate all based on best performer
        if(deadSnakes.length > 0) {
            for(; i < snakesPerGen; i++) {
                // console.log("deadSnakes[i]: " + deadSnakes[i].score);
                snakes.push(new Snake([xCells, yCells, maxScoreSnake, mutationIntensity]));
            }
        }
        // fill remaining slots
        for(; i < snakesPerGen; i++) {
            snakes.push(new Snake([xCells, yCells]));
        }
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

            //ctx.fillStyle = "hsla(" + ((snakes[snake].getScore() / genRange[1]) * 255) + ", 100%, 40%, 0.5)";
            ctx.fillStyle = "hsla(255, 100%, 100%, 0.5)";
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
