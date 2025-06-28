"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLargePrime = generateLargePrime;
const helpers_1 = require("./helpers");
const SMALL_PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
// Precompute products for small primes to optimize divisibility checks
const SMALL_PRIME_PRODUCT = SMALL_PRIMES.reduce((acc, p) => acc * BigInt(p), 1n);
function isDivisibleBySmallPrimes(num) {
    if (num < 2n)
        return true;
    for (const prime of SMALL_PRIMES) {
        if (num % BigInt(prime) === 0n && num !== BigInt(prime))
            return true;
    }
    return false;
}
function millerRabinTest(n, k = 3) {
    if (n < 2n)
        return false;
    if (n === 2n || n === 3n)
        return true;
    if (n % 2n === 0n)
        return false;
    // Deterministic bases for small numbers (up to 2^32)
    const deterministicBases = [2n, 3n, 5n, 7n];
    if (n < 1373653n)
        return deterministicBases.slice(0, 2).every(a => {
            return (0, helpers_1.modExp)(a, n - 1n, n) === 1n;
        });
    if (n < 9080191n)
        return deterministicBases.slice(0, 3).every(a => {
            return (0, helpers_1.modExp)(a, n - 1n, n) === 1n;
        });
    let s = 0n;
    let d = n - 1n;
    while (d % 2n === 0n) {
        d /= 2n;
        s++;
    }
    for (let i = 0; i < k; i++) {
        const a = BigInt(Math.floor(Math.random() * Number(n - 4n))) + 2n;
        let x = (0, helpers_1.modExp)(a, d, n);
        if (x === 1n || x === n - 1n)
            continue;
        let isComposite = true;
        for (let r = 0n; r < s - 1n; r++) {
            x = (0, helpers_1.modExp)(x, 2n, n);
            if (x === n - 1n) {
                isComposite = false;
                break;
            }
        }
        if (isComposite)
            return false;
    }
    return true;
}
function generateLargePrime(bits) {
    if (bits < 2)
        throw new Error("Number of bits must be >= 2");
    const min = 1n << BigInt(bits - 1);
    const max = (1n << BigInt(bits)) - 1n;
    while (true) {
        // Generate a random odd number in the range [2^(bits-1), 2^bits - 1]
        let prime = min + (BigInt(Math.floor(Math.random() * Number(max - min))) | 1n);
        // Ensure not divisible by small primes efficiently
        if (!isDivisibleBySmallPrimes(prime)) {
            if (millerRabinTest(prime)) {
                return prime;
            }
        }
    }
}
//# sourceMappingURL=generate_large_primes.js.map