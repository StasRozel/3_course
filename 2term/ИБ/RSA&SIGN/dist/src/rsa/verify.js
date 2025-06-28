"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = verifySignature;
const helpers_1 = require("./helpers");
const encoding_1 = require("./encoding");
function verifySignature(message, signature, publicKey) {
    const [e, n] = publicKey;
    // Хешируем исходное сообщение с учетом модуля n
    const messageHash = (0, encoding_1.createMessageHash)(message, n);
    // Расшифровываем подпись с помощью публичного ключа
    const decryptedSignature = (0, helpers_1.modExp)(signature, e, n);
    // Сравниваем с хешем исходного сообщения
    return decryptedSignature === messageHash;
}
//# sourceMappingURL=verify.js.map