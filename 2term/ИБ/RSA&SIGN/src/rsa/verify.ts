import { modExp } from './helpers';
import { createMessageHash } from './encoding';

export function verifySignature(message: string, signature: bigint, publicKey: [bigint, bigint]): boolean {
    const [e, n] = publicKey;
    // Хешируем исходное сообщение с учетом модуля n
    const messageHash = createMessageHash(message, n);
    // Расшифровываем подпись с помощью публичного ключа
    const decryptedSignature = modExp(signature, e, n);
    // Сравниваем с хешем исходного сообщения
    return decryptedSignature === messageHash;
}