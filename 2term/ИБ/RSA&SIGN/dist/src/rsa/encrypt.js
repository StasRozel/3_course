"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptMessage = encryptMessage;
const helpers_1 = require("./helpers");
const encoding_1 = require("./encoding");
function encryptMessage(message, publicKey) {
    const [e, n] = publicKey;
    const messageNumber = (0, encoding_1.textToNumber)(message);
    if (messageNumber >= n) {
        throw new Error('Message is too long for the key size.');
    }
    return (0, helpers_1.modExp)(messageNumber, e, n);
}
//# sourceMappingURL=encrypt.js.map