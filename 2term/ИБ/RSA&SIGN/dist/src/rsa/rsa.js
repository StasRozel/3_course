"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRSAKeyPair = generateRSAKeyPair;
const helpers_1 = require("./helpers");
const generate_large_primes_1 = require("./generate_large_primes");
function generateRSAKeyPair(bits = 2048) {
    const p = (0, generate_large_primes_1.generateLargePrime)(bits / 2);
    const q = (0, generate_large_primes_1.generateLargePrime)(bits / 2);
    const n = p * q;
    const phi = (p - 1n) * (q - 1n);
    const e = 65537n;
    const d = (0, helpers_1.modInverse)(e, phi);
    return {
        publicKey: [e.toString(), n.toString()],
        privateKey: [d.toString(), n.toString()],
    };
}
//# sourceMappingURL=rsa.js.map