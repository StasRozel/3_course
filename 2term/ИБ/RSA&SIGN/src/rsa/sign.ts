import { modExp } from './helpers';
import { createMessageHash } from "./encoding";

export function signMessage(message: string, privateKey: [bigint, bigint]): bigint {
    const [d, n] = privateKey;
    // Вместо преобразования всего сообщения в число, хешируем его с учетом модуля n
    const messageHash = createMessageHash(message, n);
    // Подписываем хеш сообщения
    return modExp(messageHash, d, n);
}