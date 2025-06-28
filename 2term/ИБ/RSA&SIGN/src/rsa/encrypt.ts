import { modExp } from './helpers';
import { textToNumber } from './encoding';

export function encryptMessage(message: string, publicKey: [bigint, bigint]): bigint {
    const [e, n] = publicKey;
    const messageNumber = textToNumber(message);
    if (messageNumber >= n) {
        throw new Error('Message is too long for the key size.');
    }
    return modExp(messageNumber, e, n);
}