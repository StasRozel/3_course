const readline = require('readline');
const fs = require('fs');

const belarusianAlphabet = [
  'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'І', 
  'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 
  'У', 'Ў', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Ы', 'Ь', 'Э', 
  'Ю', 'Я'
];

const alphabets = {};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function removeDuplicateLetters(word) {
    return Array.from(new Set(word)).join('').toUpperCase();
}

function removeLettersArray(array1, array2) {
    const lettersToRemove = new Set(array1);
    return array2.filter(letter => !lettersToRemove.has(letter));
}

function createNewAlphabet(keyword, number) {
    const belAlphabet = [...belarusianAlphabet];
    const arrKeyword = removeDuplicateLetters(keyword).split('');
    const chunk1 = belAlphabet.splice(number, belAlphabet.length);
    const chunk2 = belAlphabet.splice(0, number);

    return [
        ...removeLettersArray(arrKeyword, chunk1),
        ...arrKeyword,
        ...removeLettersArray(arrKeyword, chunk2)
    ]

}

function createMapAlphabet(newAlphabet) {
    for (let i = 0; i <  newAlphabet.length; i++) {
            alphabets[belarusianAlphabet[i]] = newAlphabet[i];   
    }
}

function _decode(text, replacements) {
    let result = '';

    for (const char of text.toUpperCase()) {
        result += replacements[char] || char;
    }

    return result;
}

function _encode(text, replacements) {
    const reversedReplacements = Object.fromEntries(
        Object.entries(replacements).map(([key, value]) => [value, key])
    );

    let result = '';

    for (const char of text) {
        result += reversedReplacements[char] || char;
    }

    return result;
}

rl.question('Введите число: ', (number) => {
    rl.question('Введите ключевое слово: ', (keyword) => {

        const text = fs.readFileSync('encode.txt', 'utf8');
        const newAlphabet = createNewAlphabet(keyword, number);
        console.log(newAlphabet);
        createMapAlphabet(newAlphabet);
        const decodeText = _decode(text, alphabets);
        fs.writeFileSync('decode.txt', decodeText);
        const textDecode = fs.readFileSync('decode.txt', 'utf8');
        const textEncode = _encode(textDecode, alphabets); 
        fs.writeFileSync('encodeNew.txt', textEncode);
        rl.close();
    });
});