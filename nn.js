/*
input = [...];
hidden_layers = [...];
output = [...];
*/

class NeuralNetwork {
    constructor(params) {
        let layers = params[0];
        let oldNN = params[1];
        let mutationIntensity = params[2];

        this.layers = [];
        this.aVectors = [];
        this.thetaMatrices = oldNN instanceof NeuralNetwork ? Array.from(oldNN.thetaMatrices) : [];
        this.biases = oldNN instanceof NeuralNetwork ? Array.from(oldNN.biases) : [];

        this.activationFunction = function(z) {
            // return 1 / 1 + e^(-z)
            return 1 / (1 + Math.pow(Math.E, (z * -1)));
            // return Math.max(0, z);
        }

        for(let i in layers) {
            this.layers.push(new Array(layers[i]));
        }

        if(!oldNN) {
            this.initializeTheta();
        } else if(mutationIntensity && oldNN instanceof NeuralNetwork) {
            this.mutate(mutationIntensity);
        }
    }

    setActivationFunction(func) {
        if(func) {
            this.activationFunction = func;
        }
    }

    input(inputVector) {
        this.layers[0] = inputVector._data;
        this.aVectors[0] = inputVector;
    }

    initializeTheta() {
        for(let i = 0; i < this.layers.length - 1; i++) {
            let tempTheta = math.zeros(this.layers[i + 1].length, this.layers[i].length);
            tempTheta = tempTheta.map(Math.random);
            this.thetaMatrices.push(tempTheta);
            let bias = math.zeros(this.layers[i + 1].length, 1);
            bias = bias.map(Math.random);
            this.biases.push(bias);
        }
    }

    predict() {
        for(let i = 1; i < this.layers.length; i++) {
            // a[0] -> inputs
            // a[i] = g(theta[i-1] * a[i-1])
            // let tmpAVector_shape = [this.thetaMatrices[i - 1]._size[0], this.aVectors[i - 1]._size[1]];
            let tmpAVector = math.multiply(this.thetaMatrices[i - 1], this.aVectors[i - 1]);
            tmpAVector = math.add(tmpAVector, this.biases[i - 1]);
            tmpAVector = tmpAVector.map(this.activationFunction);
            this.aVectors[i] = tmpAVector;
            if(i === this.layers.length - 1) {
                return this.aVectors[i];
            }
        }
    }

    // with 0 knowledge, writing a mutation function
    mutate(mutationIntensity) {
        for(let i = 0; i < this.layers.length - 1; i++) {
            let mutationMatrix = math.zeros(this.layers[i + 1].length, this.layers[i].length);
            mutationMatrix = math.dotMultiply(mutationMatrix.map(Math.random), mutationIntensity);
            this.thetaMatrices[i] = math.dotMultiply(this.thetaMatrices[i], mutationMatrix);
            mutationMatrix = math.zeros(this.layers[i + 1].length, 1);
            mutationMatrix = math.dotMultiply(mutationMatrix.map(Math.random), mutationIntensity);
            this.biases[i] = math.dotMultiply(this.biases[i], mutationMatrix);
        }
    }
}
