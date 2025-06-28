import { modExp } from './helpers';
import { numberToText } from './encoding';

export function decryptMessage(encryptedMessage: bigint, privateKey: [bigint, bigint]): string {
    const [d, n] = privateKey;
    const decryptedNumber = modExp(encryptedMessage, d, n);
    return numberToText(decryptedNumber);
}