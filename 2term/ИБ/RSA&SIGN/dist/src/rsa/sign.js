"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signMessage = signMessage;
const helpers_1 = require("./helpers");
const encoding_1 = require("./encoding");
function signMessage(message, privateKey) {
    const [d, n] = privateKey;
    // Вместо преобразования всего сообщения в число, хешируем его с учетом модуля n
    const messageHash = (0, encoding_1.createMessageHash)(message, n);
    // Подписываем хеш сообщения
    return (0, helpers_1.modExp)(messageHash, d, n);
}
//# sourceMappingURL=sign.js.map