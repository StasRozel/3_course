const fs = require('fs');

function stringDecryption(line, key, keyIndex, alphabetDivisionCode, alphabetLength) {
    let outputLine = "";
    for (const char of line) {
        const keyChar = key[keyIndex % key.length];
        const charCode = char.charCodeAt(0) - alphabetDivisionCode;
        const keyCharCode = keyChar.charCodeAt(0) - alphabetDivisionCode;
        let symbolCode = (charCode - keyCharCode + alphabetLength) % alphabetLength;
        outputLine += String.fromCharCode(symbolCode + alphabetDivisionCode);
        keyIndex++;
    }
    return { encryptedText: outputLine, newKeyIndex: keyIndex };
}

function stringEncryption(line, key, keyIndex, alphabetDivisionCode, alphabetLength) {
    let outputLine = "";
    for (const char of line) {
        const keyChar = key[keyIndex % key.length];
        const charCode = char.charCodeAt(0);
        const keyCharCode = keyChar.charCodeAt(0);
        let symbolCode;
        symbolCode = (charCode - alphabetDivisionCode + keyCharCode - alphabetDivisionCode) % alphabetLength;
        if (symbolCode < 0) symbolCode += alphabetLength;
        outputLine += String.fromCharCode(symbolCode + alphabetDivisionCode);
        keyIndex++;
    }
    return { encryptedText: outputLine, newKeyIndex: keyIndex };
}
function VigenerCipher(
    alphabetLength,
    alphabetDivisionCode,
    key,
    originalTextPath,
    encryptedTextPath
) {
    let partialLine = "";
    let keyIndex = 0;

    console.log('Начало шифрования файла.');
    const readStream = fs.createReadStream(originalTextPath, { encoding: 'utf8' });
    const writeStream = fs.createWriteStream(encryptedTextPath);

    readStream.on('data', (chunk) => {
        chunk = partialLine + chunk;
        const lines = chunk.split(/\r?\n/);
        partialLine = lines.pop() || '';

        for (let line of lines) {
            line = line.toLowerCase();
            const { encryptedText, newKeyIndex } = stringEncryption(line, key, keyIndex, alphabetDivisionCode, alphabetLength);
            keyIndex = newKeyIndex;
            writeStream.write(encryptedText + '\n');
        }
    });

    readStream.on('end', () => {
        if (partialLine) {
            partialLine = partialLine.toLowerCase();
            const { encryptedText, newKeyIndex } = stringEncryption(partialLine, key, keyIndex, alphabetDivisionCode, alphabetLength);
            keyIndex = newKeyIndex;
            writeStream.write(encryptedText + '\n');
        }
        writeStream.end();
        console.log('Конец шифрования файла.');
    });

    readStream.on('error', (err) => console.error('Ошибка при чтении файла:', err));
    writeStream.on('error', (err) => console.error('Ошибка при записи файла:', err));
}

VigenerCipher(
    26,         
    97,        
    "abobik", 
    "./texts/originalTexts/textForViginer.txt",
    "./texts/encode/encryptedViginer.txt"
);