const { performance } = require('perf_hooks');
const { DES_IP, DES_FP, DES_PC1, DES_PC2, DES_E, DES_P, DES_S, DES_LS } = require("./DES.const.module");


class DES {
	IP = DES_IP;
	FP = DES_FP;
	PC1 = DES_PC1;
	PC2 = DES_PC2;
	E = DES_E;
	P = DES_P;
	S = DES_S;
	LS = DES_LS;

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

	// Helper functions
	permute(input, table) {
		const output = [];
		for (let i = 0; i < table.length; i++) {
			output.push(input[table[i] - 1]);
		}
		return output;
	}

	leftShift(input, shifts) {
		return input.slice(shifts)
					.concat(input.slice(0, shifts));
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

	// DES Core Functions
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

	desRound(block, subkey, isDecrypt) {
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
			const roundResult = this.desRound(left.concat(right), this.subkeys[subkeyIndex], isDecrypt);
			left = roundResult[0];
			right = roundResult[1];
		}

		const preFinal = right.concat(left);
		return this.permute(preFinal, this.FP);
	}

	// Block handling
	splitIntoBlocks(data, blockSize) {
		const blocks = [];
		for (let i = 0; i < data.length; i += blockSize) {
			blocks.push(data.slice(i, i + blockSize));
		}
		return blocks;
	}

	padBlock(block, blockSize) {
		const paddingLength = blockSize - block.length;
		const padding = Array(paddingLength)
			.fill(paddingLength);
		return block.concat(padding);
	}

	unpadBlock(block) {
		const paddingLength = block[block.length - 1];
		return block.slice(0, block.length - paddingLength);
	}

	// Encryption/Decryption
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

	measureExecutionTime(func, ...args) {
		const startTime = performance.now();
		const result = func(...args);
		const endTime = performance.now();
		return { time: endTime - startTime, result };
	}
}


// Example Usage:
const key = 'bykovpav';
const des = new DES(key);

// Data to encrypt
const originalText = 'This is a secret message that needs to be encrypted using DES.';
const data = des.stringToBytes(originalText);

// Encryption
const { time: encryptionTime, result: encryptedData } = des.measureExecutionTime(des.encrypt.bind(des), data);
console.log('Encrypted:', encryptedData.map(x => x.toString(16)
												  .padStart(2, '0'))
									   .join(''));
console.log(`Encryption time: ${encryptionTime.toFixed(2)} ms`);

// Decryption
const { time: decryptionTime, result: decryptedData } = des.measureExecutionTime(des.decrypt.bind(des), encryptedData);
const decryptedText = des.bytesToString(decryptedData);
console.log('Decrypted:', decryptedText);
console.log(`Decryption time: ${decryptionTime.toFixed(2)} ms`);
