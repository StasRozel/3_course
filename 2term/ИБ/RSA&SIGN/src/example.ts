import {generateLargePrime} from "./rsa/generate_large_primes";

try {
    const prime = generateLargePrime(512);
    console.log("Сгенерированное простое число:", prime);
} catch (error) {
    console.error("Ошибка генерации простого числа:", error.message);
}