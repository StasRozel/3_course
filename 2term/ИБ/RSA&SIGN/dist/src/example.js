"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generate_large_primes_1 = require("./rsa/generate_large_primes");
try {
    const prime = (0, generate_large_primes_1.generateLargePrime)(512);
    console.log("Сгенерированное простое число:", prime);
}
catch (error) {
    console.error("Ошибка генерации простого числа:", error.message);
}
//# sourceMappingURL=example.js.map