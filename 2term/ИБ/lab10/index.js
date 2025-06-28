const seedrandom = require('seedrandom');

// Конфигурация нейронной сети
class NeuralNetworkConfig {
    constructor(N, K, L) {
        this.inputsPerPerceptron = N;  // Количество входов персептрона
        this.perceptronsCount = K;     // Количество персептронов
        this.weightLimit = L;          // Ограничения на весовые коэффициенты [-L..L]
    }

    toPerceptronConfig() {
        return new PerceptronConfig(this.inputsPerPerceptron, this.weightLimit);
    }
}

// Конфигурация персептрона
class PerceptronConfig {
    constructor(inputsCount, weightLimit) {
        this.inputsCount = inputsCount;
        this.weightLimit = weightLimit;
    }
}

// Класс персептрона
class Perceptron {
    constructor(config, rng) {
        this.config = config;
        this.weights = [];
        this.inputs = [];
        
        // Улучшенная инициализация весов - гарантируем разнообразие
        for (let i = 0; i < config.inputsCount; i++) {
            this.weights[i] = Math.floor(rng() * (2 * config.weightLimit + 1)) - config.weightLimit;
            // Избегаем нулевых весов
            if (this.weights[i] === 0) {
                this.weights[i] = rng() < 0.5 ? -1 : 1;
            }
        }
    }

    sign(x) {
        return x <= 0 ? -1 : 1;
    }

    calculateOutput(inputs) {
        this.inputs = [...inputs]; // Создаем копию для безопасности
        let sum = 0;
        
        for (let i = 0; i < this.config.inputsCount; i++) {
            sum += this.weights[i] * inputs[i];
        }
        
        return this.sign(sum);
    }

    train(networkOutput, otherNetworkOutput, perceptronOutput) {
        const myOutput = perceptronOutput !== undefined ? perceptronOutput : this.calculateOutput(this.inputs);
        
        // Исправленное правило обучения Хебба
        if (networkOutput === otherNetworkOutput) {
            // Обновляем веса только для скрытых единиц, которые согласны с выходом сети
            if (myOutput === networkOutput) {
                for (let i = 0; i < this.config.inputsCount; i++) {
                    const deltaWeight = myOutput * this.inputs[i];
                    this.weights[i] += deltaWeight;
                    
                    // Ограничиваем веса
                    this.weights[i] = Math.max(-this.config.weightLimit, 
                                             Math.min(this.config.weightLimit, this.weights[i]));
                }
            }
        }
    }

    getWeights() {
        return [...this.weights];
    }
}

// Класс нейронной сети TPM
class NeuralNetwork {
    constructor(config, rng) {
        this.config = config;
        this.perceptrons = [];
        this.output = 0;
        this.perceptronOutputs = [];
        
        for (let i = 0; i < config.perceptronsCount; i++) {
            this.perceptrons.push(new Perceptron(config.toPerceptronConfig(), rng));
        }
    }

    calculateOutput(inputs) {
        this.output = 1;
        this.perceptronOutputs = [];
        
        for (let k = 0; k < this.config.perceptronsCount; k++) {
            const startIdx = k * this.config.inputsPerPerceptron;
            const endIdx = (k + 1) * this.config.inputsPerPerceptron;
            const perceptronInputs = inputs.slice(startIdx, endIdx);
            
            const perceptronOutput = this.perceptrons[k].calculateOutput(perceptronInputs);
            this.perceptronOutputs[k] = perceptronOutput;
            this.output *= perceptronOutput;
        }
        
        return this.output;
    }

    train(otherNetworkOutput) {
        // Обучаем только те персептроны, выход которых совпадает с выходом всей сети
        for (let k = 0; k < this.config.perceptronsCount; k++) {
            if (this.perceptronOutputs[k] === this.output) {
                this.perceptrons[k].train(this.output, otherNetworkOutput, this.perceptronOutputs[k]);
            }
        }
    }

    getWeightsMatrix() {
        return this.perceptrons.map(perceptron => perceptron.getWeights());
    }

    isSynchronizedWith(otherNetwork) {
        const myWeights = this.getWeightsMatrix();
        const otherWeights = otherNetwork.getWeightsMatrix();
        
        for (let k = 0; k < this.config.perceptronsCount; k++) {
            for (let i = 0; i < this.config.inputsPerPerceptron; i++) {
                if (myWeights[k][i] !== otherWeights[k][i]) {
                    return false;
                }
            }
        }
        return true;
    }

    // Метод для проверки различий в весах
    getWeightDifferences(otherNetwork) {
        const myWeights = this.getWeightsMatrix();
        const otherWeights = otherNetwork.getWeightsMatrix();
        let differences = 0;
        
        for (let k = 0; k < this.config.perceptronsCount; k++) {
            for (let i = 0; i < this.config.inputsPerPerceptron; i++) {
                if (myWeights[k][i] !== otherWeights[k][i]) {
                    differences++;
                }
            }
        }
        return differences;
    }
}

// Функция генерации случайного входного вектора
function generateRandomInputVector(size, rng) {
    return Array.from({ length: size }, () => rng() < 0.5 ? -1 : 1);
}

// Улучшенная функция инициализации сетей с гарантированным различием
function createDifferentNetworks(config, rng) {
    let networkA, networkB;
    let attempts = 0;
    const maxAttempts = 100;
    
    do {
        networkA = new NeuralNetwork(config, rng);
        networkB = new NeuralNetwork(config, rng);
        attempts++;
    } while (networkA.isSynchronizedWith(networkB) && attempts < maxAttempts);
    
    if (attempts >= maxAttempts) {
        // Принудительно изменяем один вес во второй сети
        networkB.perceptrons[0].weights[0] = 
            (networkB.perceptrons[0].weights[0] + 1) % (2 * config.weightLimit + 1) - config.weightLimit;
    }
    
    return { networkA, networkB };
}

// Основная функция синхронизации двух сетей
function synchronizeNetworks(config, maxIterations = 50000, seed = 'default') {
    const rng = seedrandom(seed);
    console.log(`Starting synchronization with parameters: K=${config.perceptronsCount}, N=${config.inputsPerPerceptron}, L=${config.weightLimit}`);
    console.log('Training algorithm: Hebbian\n');

    const { networkA, networkB } = createDifferentNetworks(config, rng);
    
    let iterations = 0;
    let trainingSteps = 0;
    const inputSize = config.perceptronsCount * config.inputsPerPerceptron;
    
    console.log('Initial weights:');
    console.log('Network A:', networkA.getWeightsMatrix());
    console.log('Network B:', networkB.getWeightsMatrix());
    console.log(`Initial weight differences: ${networkA.getWeightDifferences(networkB)}`);
    console.log('');

    while (iterations < maxIterations && !networkA.isSynchronizedWith(networkB)) {
        const inputVector = generateRandomInputVector(inputSize, rng);
        const outputA = networkA.calculateOutput(inputVector);
        const outputB = networkB.calculateOutput(inputVector);
        
        iterations++;
        
        if (outputA === outputB) {
            networkA.train(outputB);
            networkB.train(outputA);
            trainingSteps++;
            
            if (trainingSteps % 1000 === 0) {
                const differences = networkA.getWeightDifferences(networkB);
                console.log(`Training steps: ${trainingSteps}, total iterations: ${iterations}, weight differences: ${differences}`);
            }
        }
        
        if (iterations % 10000 === 0) {
            const differences = networkA.getWeightDifferences(networkB);
            console.log(`Iteration ${iterations}, outputs: A=${outputA}, B=${outputB}, training steps: ${trainingSteps}, differences: ${differences}`);
        }
    }
    
    if (networkA.isSynchronizedWith(networkB)) {
        console.log(`Synchronization achieved in ${trainingSteps} training steps (${iterations} total iterations)!`);
        console.log('\nFinal weights:');
        console.log('Network A:', networkA.getWeightsMatrix());
        console.log('Network B:', networkB.getWeightsMatrix());
        return { success: true, iterations: trainingSteps, totalIterations: iterations, networkA, networkB };
    } else {
        const differences = networkA.getWeightDifferences(networkB);
        console.log(`Synchronization not achieved in ${maxIterations} iterations (${trainingSteps} training steps)`);
        console.log(`Final weight differences: ${differences}`);
        return { success: false, iterations: trainingSteps, totalIterations: iterations, networkA, networkB };
    }
}

// Тихая версия функции синхронизации
function synchronizeNetworksQuiet(config, maxIterations = 10000, seed = 'default') {
    const rng = seedrandom(seed);
    const { networkA, networkB } = createDifferentNetworks(config, rng);
    
    let iterations = 0;
    let trainingSteps = 0;
    const inputSize = config.perceptronsCount * config.inputsPerPerceptron;

    while (iterations < maxIterations && !networkA.isSynchronizedWith(networkB)) {
        const inputVector = generateRandomInputVector(inputSize, rng);
        const outputA = networkA.calculateOutput(inputVector);
        const outputB = networkB.calculateOutput(inputVector);
        
        iterations++;
        
        if (outputA === outputB) {
            networkA.train(outputB);
            networkB.train(outputA);
            trainingSteps++;
        }
    }
    
    return {
        success: networkA.isSynchronizedWith(networkB),
        iterations: trainingSteps,
        totalIterations: iterations,
        networkA,
        networkB
    };
}

// Функция для создания распределения шагов синхронизации
function createStepsDistribution(iterations) {
    return iterations.reduce((dist, steps) => {
        dist[steps] = (dist[steps] || 0) + 1;
        return dist;
    }, {});
}

// Функция для вывода распределения в виде таблицы
function printDistribution(distribution) {
    console.log('\n=== DISTRIBUTION: NUMBER OF SYNCHRONIZATIONS – NUMBER OF STEPS ===');
    console.log('┌──────────────┬─────────────────────┬─────────────┐');
    console.log('│ Steps        │ Synchronizations    │ Percentage  │');
    console.log('├──────────────┼─────────────────────┼─────────────┤');
    
    const sortedSteps = Object.keys(distribution).map(Number).sort((a, b) => a - b);
    const totalSyncs = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    
    for (const steps of sortedSteps) {
        const count = distribution[steps];
        const percentage = ((count / totalSyncs) * 100).toFixed(2);
        console.log(`│ ${steps.toString().padStart(12)} │ ${count.toString().padStart(19)} │ ${percentage.padStart(11)} │`);
    }
    
    console.log('└──────────────┴─────────────────────┴─────────────┘');
}

// Функция для проведения множественных экспериментов с улучшенными параметрами
function runMultipleExperiments(config, experimentsCount = 500) {
    console.log(`\n=== Running ${experimentsCount} experiments ===\n`);
    
    const results = {
        successful: 0,
        failed: 0,
        totalIterations: 0,
        minIterations: Infinity,
        maxIterations: 0,
        iterations: [],
        times: [],
        totalTime: 0,
        minTime: Infinity,
        maxTime: 0
    };
    
    const overallStartTime = process.hrtime.bigint();
    
    for (let i = 0; i < experimentsCount; i++) {
        if ((i + 1) % 50 === 0 || i === 0) {
            console.log(`Experiment ${i + 1}/${experimentsCount}`);
        }
        
        const startTime = process.hrtime.bigint();
        const result = synchronizeNetworksQuiet(config, 50000, `seed-${i}`); // Увеличили лимит итераций
        
        const endTime = process.hrtime.bigint();
        const experimentTime = Number(endTime - startTime) / 1000000;
        
        if (result.success) {
            results.successful++;
            results.iterations.push(result.iterations);
            results.totalIterations += result.iterations;
            results.minIterations = Math.min(results.minIterations, result.iterations);
            results.maxIterations = Math.max(results.maxIterations, result.iterations);
            results.times.push(experimentTime);
            results.totalTime += experimentTime;
            results.minTime = Math.min(results.minTime, experimentTime);
            results.maxTime = Math.max(results.maxTime, experimentTime);
        } else {
            results.failed++;
        }
        
        if ((i + 1) % 100 === 0) {
            console.log(`Progress: ${i + 1}/${experimentsCount} experiments completed`);
            console.log(`Successful: ${results.successful}, Failed: ${results.failed}`);
        }
    }
    
    const overallEndTime = process.hrtime.bigint();
    const totalExperimentTime = Number(overallEndTime - overallStartTime) / 1000000;
    
    console.log('\n' + '='.repeat(60));
    console.log('=== EXPERIMENT STATISTICS ===');
    console.log('='.repeat(60));
    
    console.log('\n2.1. STEP STATISTICS:');
    console.log(`Total experiments: ${experimentsCount}`);
    console.log(`Successful synchronizations: ${results.successful} (${(results.successful/experimentsCount*100).toFixed(2)}%)`);
    console.log(`Failed synchronizations: ${results.failed} (${(results.failed/experimentsCount*100).toFixed(2)}%)`);
    
    if (results.successful > 0) {
        const avgIterations = results.totalIterations / results.successful;
        console.log(`Average steps: ${avgIterations.toFixed(2)}`);
        console.log(`Minimum steps: ${results.minIterations}`);
        console.log(`Maximum steps: ${results.maxIterations}`);
        console.log(`Total steps across all experiments: ${results.totalIterations}`);
        
        const distribution = createStepsDistribution(results.iterations);
        printDistribution(distribution);
        
        console.log('\nADDITIONAL DISTRIBUTION STATISTICS:');
        const sortedSteps = Object.keys(distribution).map(Number).sort((a, b) => a - b);
        const median = results.iterations.sort((a, b) => a - b)[Math.floor(results.iterations.length / 2)];
        console.log(`Median steps: ${median}`);
        console.log(`Number of unique step counts: ${sortedSteps.length}`);
        console.log(`Most frequent step count: ${sortedSteps.find(steps => distribution[steps] === Math.max(...Object.values(distribution)))} (occurs ${Math.max(...Object.values(distribution))} times)`);
        
        console.log('\n2.3. TIME STATISTICS:');
        const avgTime = results.totalTime / results.successful;
        console.log(`Average synchronization time: ${avgTime.toFixed(3)} ms`);
        console.log(`Minimum synchronization time: ${results.minTime.toFixed(3)} ms`);
        console.log(`Maximum synchronization time: ${results.maxTime.toFixed(3)} ms`);
        console.log(`Total synchronization time: ${results.totalTime.toFixed(3)} ms`);
        
        const sortedTimes = results.times.sort((a, b) => a - b);
        const medianTime = sortedTimes[Math.floor(sortedTimes.length / 2)];
        console.log(`Median synchronization time: ${medianTime.toFixed(3)} ms`);
        
        const variance = results.times.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / results.times.length;
        const stdDev = Math.sqrt(variance);
        console.log(`Standard deviation of time: ${stdDev.toFixed(3)} ms`);
    }
    
    console.log(`\nTotal experiment time: ${(totalExperimentTime / 1000).toFixed(3)} seconds`);
    
    return results;
}

// Детальная демонстрация синхронизации
function detailedSynchronizationDemo(config, seed = 'demo') {
    const rng = seedrandom(seed);
    console.log('\n' + '='.repeat(80));
    console.log('=== DETAILED SYNCHRONIZATION DEMONSTRATION ===');
    console.log('='.repeat(80));
    
    const { networkA, networkB } = createDifferentNetworks(config, rng);
    
    let iterations = 0;
    let trainingSteps = 0;
    const inputSize = config.perceptronsCount * config.inputsPerPerceptron;
    const maxIterations = 100000;
    
    console.log(`Parameters: K=${config.perceptronsCount}, N=${config.inputsPerPerceptron}, L=${config.weightLimit}`);
    console.log('Training algorithm: Hebbian\n');
    
    console.log('Initial weights:');
    console.log('Network A:');
    networkA.getWeightsMatrix().forEach((weights, i) => {
        console.log(`  Perceptron ${i + 1}: [${weights.join(', ')}]`);
    });
    console.log('Network B:');
    networkB.getWeightsMatrix().forEach((weights, i) => {
        console.log(`  Perceptron ${i + 1}: [${weights.join(', ')}]`);
    });
    console.log(`Initial weight differences: ${networkA.getWeightDifferences(networkB)}\n`);
    
    const startTime = process.hrtime.bigint();
    let lastProgressTime = Date.now();
    
    while (iterations < maxIterations && !networkA.isSynchronizedWith(networkB)) {
        const inputVector = generateRandomInputVector(inputSize, rng);
        const outputA = networkA.calculateOutput(inputVector);
        const outputB = networkB.calculateOutput(inputVector);
        
        iterations++;
        
        if (Date.now() - lastProgressTime > 2000) {
            const differences = networkA.getWeightDifferences(networkB);
            console.log(`Iteration ${iterations}: outputs A=${outputA}, B=${outputB}, training steps: ${trainingSteps}, differences: ${differences}`);
            lastProgressTime = Date.now();
        }
        
        if (outputA === outputB) {
            networkA.train(outputB);
            networkB.train(outputA);
            trainingSteps++;
        }
    }
    
    const endTime = process.hrtime.bigint();
    const syncTime = Number(endTime - startTime) / 1000000;
    
    if (networkA.isSynchronizedWith(networkB)) {
        console.log(`\n✓ SYNCHRONIZATION ACHIEVED!`);
        console.log(`Training steps: ${trainingSteps}`);
        console.log(`Total iterations: ${iterations}`);
        console.log(`Synchronization time: ${syncTime.toFixed(3)} ms`);
        
        console.log('\nFinal weights:');
        console.log('Network A:');
        networkA.getWeightsMatrix().forEach((weights, i) => {
            console.log(`  Perceptron ${i + 1}: [${weights.join(', ')}]`);
        });
        console.log('Network B:');
        networkB.getWeightsMatrix().forEach((weights, i) => {
            console.log(`  Perceptron ${i + 1}: [${weights.join(', ')}]`);
        });
        
        return { success: true, iterations: trainingSteps, totalIterations: iterations, time: syncTime };
    } else {
        const differences = networkA.getWeightDifferences(networkB);
        console.log(`\nSynchronization not achieved in ${maxIterations} iterations`);
        console.log(`Training steps completed: ${trainingSteps}`);
        console.log(`Final weight differences: ${differences}`);
        console.log(`Time elapsed: ${syncTime.toFixed(3)} ms`);
        return { success: false, iterations: trainingSteps, totalIterations: iterations, time: syncTime };
    }
}

// Основной код выполнения с оптимизированными параметрами
function main() {
    console.log('=== TPM Neural Network Synchronization (Improved) ===');
    console.log('Algorithm: Anti-Hebbian');

    // Более сбалансированные параметры для лучшей синхронизации
    const K = 5; // Увеличили количество персептронов
    const N = 8; // Увеличили количество входов
    const L = 5; // Уменьшили диапазон весов для стабильности
    const config = new NeuralNetworkConfig(N, K, L);

    console.log('\n=== SINGLE SYNCHRONIZATION DEMO ===');
    synchronizeNetworks(config, 50000, 'single-demo');

    console.log('\n' + '='.repeat(80));
    console.log('=== MULTIPLE EXPERIMENTS (500 RUNS) ===');
    console.log('='.repeat(80));
    runMultipleExperiments(config, 500);

    console.log('\n' + '='.repeat(80));
    console.log('=== DETAILED DEMONSTRATION ===');
    console.log('='.repeat(80));
    detailedSynchronizationDemo(config, 'detailed-demo');
}

if (require.main === module) {
    main();
}

module.exports = {
    NeuralNetworkConfig,
    PerceptronConfig,
    Perceptron,
    NeuralNetwork,
    synchronizeNetworks,
    runMultipleExperiments,
    detailedSynchronizationDemo,
    synchronizeNetworksQuiet
};