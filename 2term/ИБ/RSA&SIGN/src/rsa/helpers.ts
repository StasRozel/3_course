export function modExp(base: bigint, exp: bigint, mod: bigint): bigint {
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

export function gcd(a: bigint, b: bigint): bigint {
    while (b !== 0n) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

export function modInverse(e: bigint, phi: bigint): bigint {
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