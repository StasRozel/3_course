const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto');

const BASE_URL = 'http://localhost:3000';
let sessionId = null;
let prime = null;
let generator = null;
let clientPrivateKey = null;
let sessionKey = null;

function generatePrivateKey() {
    const privateKeyBytes = crypto.randomBytes(32);
    return BigInt('0x' + privateKeyBytes.toString('hex'));
}

function calculatePublicKey(privateKey, generator, prime) {
    return powerMod(BigInt(generator), privateKey, BigInt(prime));
}

function powerMod(base, exponent, modulus) {
    let result = BigInt(1);
    
    base = base % modulus;
    
    while (exponent > 0) {
        if (exponent % BigInt(2) === BigInt(1)) {
            result = (result * base) % modulus;
        }
        exponent = exponent >> BigInt(1);

        base = (base * base) % modulus;
    }
    
    return result;
}


function createSessionKeyFromSecret(secret) {
    const secretStr = secret.toString();
    return crypto.createHash('sha256').update(secretStr).digest();
}

function decryptData(encryptedData, iv, key) {
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc', 
        key, 
        Buffer.from(iv, 'hex')
    );
    let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

async function initDiffieHellman() {
    try {
        console.log('Инициализация схемы Диффи-Хеллмана...');
        const response = await axios.get(`${BASE_URL}/`);
        
        sessionId = response.data.sessionId;
        prime = response.data.prime;
        generator = response.data.generator;
        const serverPublicKey = response.data.serverPublicKey;
        console.log('');
        console.log('Получены параметры от сервера:');
        console.log(`Идентификатор сессии: ${sessionId}`);
        console.log(`Простое число (prime): ${prime.substring(0, 20)}...`);
        console.log(`Генератор: ${generator}`);
        console.log(`Публичный ключ сервера: ${serverPublicKey.substring(0, 20)}...`);
        console.log('');

        clientPrivateKey = generatePrivateKey();

        const clientPublicKey = calculatePublicKey(clientPrivateKey, generator, prime);
        
        console.log(`Сгенерирован приватный ключ клиента: ${clientPrivateKey}`);
        console.log(`Вычислен публичный ключ клиента: ${clientPublicKey}`);
        console.log('');

        await exchangeKeys(clientPublicKey, serverPublicKey);
    } catch (error) {
        console.error('Ошибка при инициализации Диффи-Хеллмана:', error.message);
        if (error.response) {
            console.error('Ответ сервера:', error.response.data);
        }
    }
}

async function exchangeKeys(clientPublicKey, serverPublicKey) {
    try {
        console.log('Отправка публичного ключа клиента на сервер...');
        const response = await axios.get(`${BASE_URL}/exchange`, {
            params: {
                sessionId: sessionId,
                clientPublicKey: clientPublicKey.toString()
            }
        });
        
        console.log('Ответ сервера:', response.data);
        
        console.log('');

        const sharedSecret = powerMod(BigInt(serverPublicKey), clientPrivateKey, BigInt(prime));
        console.log(`Вычислен общий секрет: ${sharedSecret}`);
        
        sessionKey = createSessionKeyFromSecret(sharedSecret);
        console.log('Сеансовый ключ успешно создан');
        console.log('');

        await requestResource();
    } catch (error) {
        console.error('Ошибка при обмене ключами:', error.message);
        if (error.response) {
            console.error('Ответ сервера:', error.response.data);
        }
    }
}

async function requestResource() {
    try {
        console.log('Запрос зашифрованного ресурса...');
        const response = await axios.get(`${BASE_URL}/resource`, {
            params: {
                sessionId: sessionId
            }
        });
        
        const { iv, encryptedData } = response.data;
        console.log(`Получены зашифрованные данные: ${encryptedData}`);

        const decryptedData = decryptData(encryptedData, iv, sessionKey);
        console.log(`Расшифрованные данные: ${decryptedData}`);
        
        fs.writeFileSync('decrypted.txt', decryptedData);
        console.log('Данные успешно записаны в файл decrypted.txt');
    } catch (error) {
        console.error('Ошибка при запросе ресурса:', error.message);
        if (error.response) {
            console.error('Ответ сервера:', error.response.data);
        }
    }
}

console.log('Запуск клиента...');
initDiffieHellman();
