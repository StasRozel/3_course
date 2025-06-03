const fs = require('fs');
const readline = require('readline');

const ALPHABET = [
    'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'І',
    'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т',
    'У', 'Ў', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Ы', 'Ь', 'Э',
    'Ю', 'Я'
];

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

function createTableWithKeyword(keyword) {
    const uniqueChars = Array.from(new Set(keyword.toUpperCase().split('')));

    const validKeyChars = uniqueChars.filter(char => ALPHABET.includes(char));

    const remainingChars = ALPHABET.filter(char => !validKeyChars.includes(char));
    const newAlphabet = [...validKeyChars, ...remainingChars];

    const rows = 8;
    const cols = 4;
    const table = [];

    let charIndex = 0;
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            if (charIndex < newAlphabet.length) {
                row.push(newAlphabet[charIndex]);
                charIndex++;
            } else {
                row.push('');
            }
        }
        table.push(row);
    }

    return table;
}

function encrypt(text, keyword) {
    const table = createTableWithKeyword(keyword);

    return text.toUpperCase().split('').map(char => {
        if (!ALPHABET.includes(char)) {
            return char;
        }

        for (let i = 0; i < table.length; i++) {
            for (let j = 0; j < table[i].length; j++) {
                if (table[i][j] === char) {
                    const nextJ = (j + 1) % table[i].length;
                    return table[i][nextJ] || char;
                }
            }
        }

        return char;
    }).join('');
}

function decrypt(encryptedText, keyword) {
    const table = createTableWithKeyword(keyword);

    return encryptedText.toUpperCase().split('').map(char => {
        if (!ALPHABET.includes(char)) {
            return char;
        }

        for (let i = 0; i < table.length; i++) {
            for (let j = 0; j < table[i].length; j++) {
                if (table[i][j] === char) {
                    const prevJ = (j - 1 + table[i].length) % table[i].length;
                    return table[i][prevJ] || char;
                }
            }
        }

        return char;
    }).join('');
}

function printTable(table) {
    console.log('Таблица шифрования:');
    for (let i = 0; i < table.length; i++) {
        console.log(table[i].join('\t'));
    }
}

rl.question('Введите ключевое слово: ', (keyword) => {
    const originalText = fs.readFileSync('./texts/originalTexts/newLand.txt', 'utf8');
    countCharacters(originalText);
    const table = createTableWithKeyword(keyword);
    printTable(table);
    console.time("Execute time");
    const encryptedText = encrypt(originalText, keyword);
    console.timeEnd("Execute time");
    countCharacters(encryptedText);
    fs.writeFileSync('./texts/encode/encodeNewLand.txt', encryptedText);

    const encodeText = fs.readFileSync('./texts/encode/encodeNewLand.txt', 'utf8');
    console.time("Execute time");
    const decodeText = decrypt(encodeText, keyword);
    console.timeEnd("Execute time");
    fs.writeFileSync('./texts/decode/decodeNewLand.txt', decodeText);
    rl.close();
});
