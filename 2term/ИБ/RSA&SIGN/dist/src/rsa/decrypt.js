"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptMessage = decryptMessage;
const helpers_1 = require("./helpers");
const encoding_1 = require("./encoding");
function decryptMessage(encryptedMessage, privateKey) {
    const [d, n] = privateKey;
    const decryptedNumber = (0, helpers_1.modExp)(encryptedMessage, d, n);
    return (0, encoding_1.numberToText)(decryptedNumber);
}
//# sourceMappingURL=decrypt.js.map