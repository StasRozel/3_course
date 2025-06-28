"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textToNumber = textToNumber;
exports.numberToText = numberToText;
exports.createMessageHash = createMessageHash;
function textToNumber(text) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    return BigInt('0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(''));
}
function numberToText(num) {
    const hex = num.toString(16);
    // Если длина нечетная, добавляем ведущий ноль
    const paddedHex = hex.length % 2 ? '0' + hex : hex;
    const bytes = new Uint8Array(paddedHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
}
// Стабильная и простая функция хеширования для учебных целей
// Возвращает значение хеша как bigint, всегда меньше модуля n
function createMessageHash(message, modulus) {
    // Преобразуем строку в число
    let hash = 0n;
    for (let i = 0; i < message.length; i++) {
        hash = (hash * 65537n + BigInt(message.charCodeAt(i))) % modulus;
    }
    return hash;
}
//# sourceMappingURL=encoding.js.map