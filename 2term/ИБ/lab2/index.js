const fs = require('fs');

function cleanText(text, language) {
    const cleaningRules = {
        serbian: {
            removePattern: /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~0-9\s]/g,
        },
        italian: {
            removePattern: /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~0-9\sа-яА-Я]/g,
        },
        binary: {
            removePattern: /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~2-9\s^a-zA-ZА-Яа-я]/g,
        }
    };

    if (!cleaningRules[language]) {
        console.log('Unsupported language');
        return;
    }

    return text.replace(cleaningRules[language].removePattern, '').toUpperCase();
}

function counterInformation(entropy, numberLatter) {
    return entropy * numberLatter;
}

function calculateEntropy(probabilities) {
    let entropy = 0;
    for (let p of probabilities) {
        entropy += p * Math.log2(p);
    }
    return -entropy.toFixed(2);
}

function calculateErrorEntropy(p) {
    if (p < 0 || p > 1) {
        throw new Error('Вероятность p должна быть в диапазоне от 0 до 1');
    }

    const q = 1 - p;

    const conditionalEntropy = 
    (p > 0 ? -p * Math.log2(p) : 0) + 
    (q > 0 ? -q * Math.log2(q) : 0);


    const errorEntropy = 1 - conditionalEntropy;

    return errorEntropy.toFixed(2);
}

function getLetterFrequencies(text) {
    const letterFreq = {};
    for (let char of text) {
        if (letterFreq[char]) {
            letterFreq[char]++;
        } else {
            letterFreq[char] = 1;
        }
    }
    return letterFreq;
}

function analyzeText(filePath, language) {
    const rawText = fs.readFileSync(filePath, 'utf8');
    const cleanedText = cleanText(rawText, language);
    const probabilitiesError = [0.1, 0.5, 1.0];
    const errorEntropy = [];

    const letterFreq = getLetterFrequencies(cleanedText);
    const probabilities = {};
    const totalCharacters = cleanedText.length;

    for (const [char, count] of Object.entries(letterFreq)) {
        probabilities[char] = count / totalCharacters;
    }

    const entropy = calculateEntropy(Object.values(probabilities));
    const counterInfo = counterInformation(entropy, totalCharacters);
    if (language == 'binary') {
        probabilitiesError.forEach(pr => {
            errorEntropy.push(calculateErrorEntropy(pr));
        })
    }
    return {
        entropy,
        letterFreq,
        probabilities,
        totalCharacters,
        counterInfo,
        errorEntropy
    };
}

function printLanguageAnalysis(analysis) {
    const errorEntropy = analysis.errorEntropy.toString();
    console.log('Энтропия алфавита:', analysis.entropy);
    console.log('Частота символов алфавита:', analysis.letterFreq);
    console.log('Вероятности алфавита:');
    for (const [char, prob] of Object.entries(analysis.probabilities)) {
        console.log(`${char}: ${prob.toFixed(4)}`);
    }
    console.log('Общее количество символов:', analysis.totalCharacters);
    console.log('Количество информации:', analysis.counterInfo);
    errorEntropy != '' ? console.log('Энтропия с ошибочной вероятностью:', errorEntropy) : console.log(); 
}

const serbianAnalysis = analyzeText('example_texts/serbian_text.txt', 'serbian');
const italianAnalysis = analyzeText('example_texts/italian_text.txt', 'italian');
const binaryAnalysis = analyzeText('example_texts/binary_text.txt', 'binary');

const fioSerbian = analyzeText('example_texts/fio_sb.txt', 'serbian');
const fioSerbianAscii = analyzeText('example_texts/fio_sb_ascii.txt', 'binary');

const fioItalian = analyzeText('example_texts/fio_it.txt', 'italian');
const fioItalianAscii = analyzeText('example_texts/fio_it_ascii.txt', 'binary');

console.log('=== Анализ сербского текста ===');
printLanguageAnalysis(serbianAnalysis);

console.log('\n=== Анализ итальянского текста ===');
printLanguageAnalysis(italianAnalysis);

console.log('\n=== Анализ бинарного текста ===');
printLanguageAnalysis(binaryAnalysis);

console.log('\n=== Количество информации сербского ФИО===');
console.log(fioSerbian.counterInfo);
console.log('\n=== Количество информации сербского бинарного ФИО===');
console.log(fioSerbianAscii.counterInfo);
console.log('\n=== Количество информации итальянского ФИО===');
console.log(fioItalian.counterInfo);
console.log('\n=== Количество информации сербского бинарного ФИО===');
console.log(fioItalianAscii.counterInfo);