"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modExp = modExp;
exports.gcd = gcd;
exports.modInverse = modInverse;
function modExp(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        exp = exp / 2n;
        base = (base * base) % mod;
    }
    return result;
}
function gcd(a, b) {
    while (b !== 0n) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}
function modInverse(e, phi) {
    let m0 = phi;
    let x0 = 0n;
    let x1 = 1n;
    while (e > 1n) {
        const q = e / phi;
        const temp = phi;
        phi = e % phi;
        e = temp;
        const xTemp = x0;
        x0 = x1 - q * x0;
        x1 = xTemp;
    }
    if (x1 < 0n) {
        x1 += m0;
    }
    return x1;
}
//# sourceMappingURL=helpers.js.map