const fs = require('fs');

function VigenerDecryptor(encryptedTextPath, decryptedTextPath) {
    const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
    const ALPHABET_LENGTH = ALPHABET.length;

    const encryptedText = fs.readFileSync(encryptedTextPath, { encoding: 'utf8' }).replace(/\r?\n/g, '').toLowerCase();

    console.log('Начало дешифрования...');

    function analyzeKeyLength(text, maxKeyLength) {
        let probableKeyLength = 1;
        let maxCoincidenceIndex = 0;

        for (let keyLength = 1; keyLength <= maxKeyLength; keyLength++) {
            const substrings = Array.from({ length: keyLength }, (_, i) => text.split('').filter((_, index) => index % keyLength === i).join(''));

            const coincidenceIndex = substrings.reduce((sum, substr) => {
                const freq = substr.split('').reduce((acc, char) => ({ ...acc, [char]: (acc[char] || 0) + 1 }), {});
                const substrLength = substr.length;
                return sum + Object.values(freq).reduce((acc, f) => acc + (f * (f - 1)) / (substrLength * (substrLength - 1)), 0);
            }, 0) / substrings.length;

            if (coincidenceIndex > maxCoincidenceIndex) {
                maxCoincidenceIndex = coincidenceIndex;
                probableKeyLength = keyLength;
            }
        }
        return probableKeyLength;
    }

    function findKey(text, keyLength) {
        let key = '';
        for (let i = 0; i < keyLength; i++) {
            const substring = text.split('').filter((_, index) => index % keyLength === i).join('');
            const freq = substring.split('').reduce((acc, char) => ({ ...acc, [char]: (acc[char] || 0) + 1 }), {});
            const mostFrequentChar = Object.entries(freq).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
            const keyChar = String.fromCharCode(((mostFrequentChar.charCodeAt(0) - 'e'.charCodeAt(0) + ALPHABET_LENGTH) % ALPHABET_LENGTH) + 'a'.charCodeAt(0));
            key += keyChar;
        }

        for (let length = 1; length <= key.length; length++) {
            const candidate = key.slice(0, length);
            if (candidate.repeat(Math.ceil(key.length / length)).startsWith(key)) {
                return candidate;
            }
        }

        return key;
    }


    function decrypt(text, key) {
        let decryptedText = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = (text.charCodeAt(i) - key.charCodeAt(i % key.length) + ALPHABET_LENGTH) % ALPHABET_LENGTH;
            decryptedText += String.fromCharCode(charCode + 'a'.charCodeAt(0));
        }
        return decryptedText;
    }

    const keyLength = analyzeKeyLength(encryptedText, 20);
    const key = findKey(encryptedText, keyLength);

    console.log(`Найден ключ: ${key}`);

    const decryptedText = decrypt(encryptedText, key);

    fs.writeFileSync(decryptedTextPath, decryptedText, { encoding: 'utf8' });

    console.log('Расшифровка завершена.');
}

VigenerDecryptor("./texts/encode/encryptedViginer.txt", "./texts/decode/decryptedViginer(from viginerDecryptor.js).txt");