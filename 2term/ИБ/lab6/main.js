const { performance } = require('perf_hooks');
const fs = require('fs').promises;

const IP = [
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7
];

const IP_INV = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41, 9, 49, 17, 57, 25
];

const E = [
    32, 1, 2, 3, 4, 5,
    4, 5, 6, 7, 8, 9,
    8, 9, 10, 11, 12, 13,
    12, 13, 14, 15, 16, 17,
    16, 17, 18, 19, 20, 21,
    20, 21, 22, 23, 24, 25,
    24, 25, 26, 27, 28, 29,
    28, 29, 30, 31, 32, 1
];

const P = [
    16, 7, 20, 21, 29, 12, 28, 17,
    1, 15, 23, 26, 5, 18, 31, 10,
    2, 8, 24, 14, 32, 27, 3, 9,
    19, 13, 30, 6, 22, 11, 4, 25
];

const S = [
    [
        [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
        [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
        [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
        [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
    ],
    [
        [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
        [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
        [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
        [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
    ],
    [
        [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
        [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
        [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
        [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
    ],
    [
        [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
        [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
        [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
        [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
    ],
    [
        [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
        [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
        [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
        [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
    ],
    [
        [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
        [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
        [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
        [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
    ],
    [
        [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
        [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
        [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
        [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
    ],
    [
        [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
        [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
        [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
        [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
    ]
];

const PC1 = [
    57, 49, 41, 33, 25, 17, 9,
    1, 58, 50, 42, 34, 26, 18,
    10, 2, 59, 51, 43, 35, 27,
    19, 11, 3, 60, 52, 44, 36,
    63, 55, 47, 39, 31, 23, 15,
    7, 62, 54, 46, 38, 30, 22,
    14, 6, 61, 53, 45, 37, 29,
    21, 13, 5, 28, 20, 12, 4
];

const PC2 = [
    14, 17, 11, 24, 1, 5,
    3, 28, 15, 6, 21, 10,
    23, 19, 12, 4, 26, 8,
    16, 7, 27, 20, 13, 2,
    41, 52, 31, 37, 47, 55,
    30, 40, 51, 45, 33, 48,
    44, 49, 39, 56, 34, 53,
    46, 42, 50, 36, 29, 32
];

const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

class DES {
    IP = IP;
    FP = IP_INV;
    PC1 = PC1;
    PC2 = PC2;
    SHIFTS = SHIFTS;
    E = E;
    P = P;
    S = S;
    LS = SHIFTS;

    constructor(key) {
        if (key.length !== 8) {
            throw new Error('DES key must be 8 bytes long.');
        }
        this.key = this.stringToBytes(key);
        this.subkeys = this.generateSubkeys(this.key);
    }

    stringToBytes(str) {
        const bytes = [];
        for (let i = 0; i < str.length; i++) {
            bytes.push(str.charCodeAt(i));
        }
        return bytes;
    }

    bytesToString(bytes) {
        let str = '';
        for (let i = 0; i < bytes.length; i++) {
            str += String.fromCharCode(bytes[i]);
        }
        return str;
    }

    permute(input, table) {
        const output = [];
        for (let i = 0; i < table.length; i++) {
            output.push(input[table[i] - 1]);
        }
        return output;
    }

    leftShift(input, shifts) {
        return input.slice(shifts).concat(input.slice(0, shifts));
    }

    xor(a, b) {
        const result = [];
        for (let i = 0; i < a.length; i++) {
            result.push(a[i] ^ b[i]);
        }
        return result;
    }

    bytesToBits(bytes) {
        const bits = [];
        for (let i = 0; i < bytes.length; i++) {
            for (let j = 7; j >= 0; j--) {
                bits.push((bytes[i] >> j) & 1);
            }
        }
        return bits;
    }

    bitsToBytes(bits) {
        const bytes = [];
        for (let i = 0; i < bits.length; i += 8) {
            let byte = 0;
            for (let j = 0; j < 8; j++) {
                byte = (byte << 1) | (bits[i + j] || 0);
            }
            bytes.push(byte);
        }
        return bytes;
    }

    bitsToNumber(bits) {
        let num = 0;
        for (let i = 0; i < bits.length; i++) {
            num = (num << 1) | bits[i];
        }
        return num;
    }

    numberToBits(num, length) {
        const bits = [];
        for (let i = length - 1; i >= 0; i--) {
            bits.push((num >> i) & 1);
        }
        return bits;
    }

    f(right, subkey) {
        const expanded = this.permute(right, this.E);
        const xored = this.xor(expanded, subkey);
        const sBoxesOutput = [];
        for (let i = 0; i < 8; i++) {
            const block = xored.slice(i * 6, (i + 1) * 6);
            const row = this.bitsToNumber([block[0], block[5]]);
            const col = this.bitsToNumber(block.slice(1, 5));
            const sValue = this.S[i][row][col];
            sBoxesOutput.push(...this.numberToBits(sValue, 4));
        }
        return this.permute(sBoxesOutput, this.P);
    }

    generateSubkeys(key) {
        const bits = this.bytesToBits(key);
        const permuted = this.permute(bits, this.PC1);
        let C = permuted.slice(0, 28);
        let D = permuted.slice(28);
        const subkeys = [];
        for (let i = 0; i < 16; i++) {
            C = this.leftShift(C, this.LS[i]);
            D = this.leftShift(D, this.LS[i]);
            const CD = C.concat(D);
            subkeys.push(this.permute(CD, this.PC2));
        }
        return subkeys;
    }

    desRound(block, subkey) {
        let left = block.slice(0, 32);
        let right = block.slice(32);
        const fResult = this.f(right, subkey);
        const xored = this.xor(left, fResult);
        return [right, xored];
    }

    desBlock(block, isDecrypt) {
        const permuted = this.permute(block, this.IP);
        let left = permuted.slice(0, 32);
        let right = permuted.slice(32);

        for (let i = 0; i < 16; i++) {
            const subkeyIndex = isDecrypt ? 15 - i : i;
            const roundResult = this.desRound(left.concat(right), this.subkeys[subkeyIndex]);
            left = roundResult[0];
            right = roundResult[1];
        }

        const preFinal = right.concat(left);
        return this.permute(preFinal, this.FP);
    }

    splitIntoBlocks(data, blockSize) {
        const blocks = [];
        for (let i = 0; i < data.length; i += blockSize) {
            blocks.push(data.slice(i, i + blockSize));
        }
        return blocks;
    }

    padBlock(block, blockSize) {
        const paddingLength = blockSize - block.length;
        const padding = Array(paddingLength).fill(paddingLength);
        return block.concat(padding);
    }

    unpadBlock(block) {
        const paddingLength = block[block.length - 1];
        return block.slice(0, block.length - paddingLength);
    }

    encrypt(data) {
        const blockSize = 8;
        const blocks = this.splitIntoBlocks(data, blockSize);
        const encryptedBlocks = [];

        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            const paddedBlock = i === blocks.length - 1 ? this.padBlock(block, blockSize) : block;
            const bits = this.bytesToBits(paddedBlock);
            const encryptedBits = this.desBlock(bits, false);
            const encryptedBytes = this.bitsToBytes(encryptedBits);
            encryptedBlocks.push(encryptedBytes);
        }

        return [].concat(...encryptedBlocks);
    }

    decrypt(data) {
        const blockSize = 8;
        const blocks = this.splitIntoBlocks(data, blockSize);
        const decryptedBlocks = [];

        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            const bits = this.bytesToBits(block);
            const decryptedBits = this.desBlock(bits, true);
            const decryptedBytes = this.bitsToBytes(decryptedBits);
            decryptedBlocks.push(decryptedBytes);
        }

        const lastBlock = decryptedBlocks[decryptedBlocks.length - 1];
        const unpaddedLastBlock = this.unpadBlock(lastBlock);
        decryptedBlocks[decryptedBlocks.length - 1] = unpaddedLastBlock;

        return [].concat(...decryptedBlocks);
    }

    async encryptFile(inputFile, outputFile) {
        try {
            const text = await fs.readFile(inputFile, 'utf8');
            const data = this.stringToBytes(text);
            const { time: encryptionTime, result: encryptedData } = this.measureExecutionTime(this.encrypt.bind(this), data);
            const encryptedHex = encryptedData.map(x => x.toString(16).padStart(2, '0')).join('');
            await fs.writeFile(outputFile, encryptedHex);
            console.log(`Encryption completed in ${encryptionTime.toFixed(2)} ms. Output written to ${outputFile}`);
            return encryptedData;
        } catch (error) {
            console.error('Encryption error:', error.message);
            throw error;
        }
    }

    async decryptFile(inputFile, outputFile) {
        try {
            const hexData = await fs.readFile(inputFile, 'utf8');
            const encryptedData = [];
            for (let i = 0; i < hexData.length; i += 2) {
                encryptedData.push(parseInt(hexData.substr(i, 2), 16));
            }
            const { time: decryptionTime, result: decryptedData } = this.measureExecutionTime(this.decrypt.bind(this), encryptedData);
            const decryptedText = this.bytesToString(decryptedData);
            await fs.writeFile(outputFile, decryptedText);
            console.log(`Decryption completed in ${decryptionTime.toFixed(2)} ms. Output written to ${outputFile}`);
            return decryptedText;
        } catch (error) {
            console.error('Decryption error:', error.message);
            throw error;
        }
    }

    measureExecutionTime(func, ...args) {
        const startTime = performance.now();
        const result = func(...args);
        const endTime = performance.now();
        return { time: endTime - startTime, result };
    }
}

async function main() {
    const key = 'abobafor';
    const des = new DES(key);

    // Example usage with files
    try {
        // Encrypt file
        await des.encryptFile('input.txt', 'encrypted.txt');

        // Decrypt file
        await des.decryptFile('encrypted.txt', 'decrypted.txt');
    } catch (error) {
        console.error('Operation failed:', error.message);
    }
}

main();
