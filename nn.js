/*
input = [...];
hidden_layers = [...];
output = [...];
*/

class NeuralNetwork {
    constructor(layers) {
        this.layers = [];
        this.aVectors = [];
        this.thetaMatrices = [];

        this.activationFunction = function(z) {
            return 1 / (1 + Math.pow(Math.E, (z * -1)));
        }

        for(let i in layers) {
            this.layers.push(new Array(layers[i]));
        }

        this.initializeTheta();
    }

    setActivationFunction(func) {
        if(func) {
            this.activationFunction = func;
        }
    }

    input(inputVector) {
        this.layers[0] = inputVector;
        this.aVectors[0] = inputVector;
    }

    initializeTheta() {
        for(let i = 0; i < this.layers.length - 1; i++) {
            let tempTheta = math.zeros(this.layers[i + 1].length, this.layers[i].length);
            tempTheta = tempTheta.map(Math.random);
            this.thetaMatrices.push(tempTheta);
        }
    }

    predict() {
        for(let i = 1; i < this.layers.length; i++) {
            this.aVectors[i] = (math.multiply(this.thetaMatrices[i - 1], this.aVectors[i - 1])).map(this.activationFunction);
            if(i === this.layers.length - 1) {
                return this.aVectors[i];
            }
        }
    }
}