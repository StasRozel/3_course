import {modInverse} from "./helpers";
import {generateLargePrime} from "./generate_large_primes";

export function generateRSAKeyPair(bits: number = 2048): {
    publicKey: [string, string];
    privateKey: [string, string]
} {
    const p = generateLargePrime(bits / 2);
    const q = generateLargePrime(bits / 2);

    const n = p * q;
    const phi = (p - 1n) * (q - 1n);
    const e = 65537n;
    const d = modInverse(e, phi);

    return {
        publicKey: [e.toString(), n.toString()],
        privateKey: [d.toString(), n.toString()],
    };
}