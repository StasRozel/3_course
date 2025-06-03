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

function countCharacters(text) {
    const charCount = {};
    for (const char of text) {
      charCount[char] = (charCount[char] || 0) + 1;
    }
    const charArray = Object.entries(charCount).sort((a, b) => b[1] - a[1]);
    console.log('Символ | Количество');
    console.log('-----------------');
    charArray.forEach(([char, count]) => {
      const displayChar = char === ' ' ? '[пробел]' : char;
      console.log(`'${displayChar}' | ${count}`);
    });
    console.log(`\nВсего уникальных символов: ${charArray.length}`);
    console.log(`Общая длина текста: ${text.length} символов`);
  }

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

function _encode(text, replacements) {
    let result = '';

    for (const char of text.toUpperCase()) {
        result += replacements[char] || char;
    }

    return result;
}

function _decode(text, replacements) {
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

        const text = fs.readFileSync('./texts/originalTexts/newLand.txt', 'utf8');
        countCharacters(text);
        const newAlphabet = createNewAlphabet(keyword, number);
        console.log(newAlphabet);
        createMapAlphabet(newAlphabet);
        console.time("Execute time");
        const encodeText = _encode(text, alphabets);
        console.timeEnd("Execute time");
        countCharacters(encodeText);
        fs.writeFileSync('./texts/encode/encodeNewLand.txt', encodeText);
        const textEncode = fs.readFileSync('./texts/encode/encodeNewLand.txt', 'utf8');
        console.time("Execute time");
        const textDecode = _decode(textEncode, alphabets); 
        console.timeEnd("Execute time");
        fs.writeFileSync('./texts/decode/decodeNewLand.txt', textDecode);
        rl.close();
    });
});