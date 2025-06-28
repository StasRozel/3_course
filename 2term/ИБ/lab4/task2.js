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
                    return table[i][0];
                }
            }
        }

        return char;
    }).join('');
}

function decrypt(encryptedText, keyword) {
    const table = createTableWithKeyword(keyword);

    return encryptedText.toLowerCase().split('').map(char => {
        if (!ALPHABET.includes(char)) {
            return char;
        }

        for (let i = 0; i < table.length; i++) {
            if (table[i][0] === char) {
                return char;
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
    const originalText = fs.readFileSync('encode.txt', 'utf8');

    const table = createTableWithKeyword(keyword);
    printTable(table);

    const encryptedText = encrypt(originalText, keyword);
    fs.writeFileSync('decode.txt', encryptedText);
    rl.close();
});
