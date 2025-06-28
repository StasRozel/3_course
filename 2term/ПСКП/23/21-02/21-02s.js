const express = require('express');
const crypto = require('crypto');
const student = require('./student.json');

const app = express();
const port = 3000;

const sessions = new Map();

const prime = BigInt('23');
const generator = BigInt('5');

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
});

function generatePrivateKey() {
    const privateKeyBytes = crypto.randomBytes(32);
    return BigInt('0x' + privateKeyBytes.toString('hex'));
}

function calculatePublicKey(privateKey) {
    return powerMod(generator, privateKey, prime);
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

function encryptData(data, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex'),
    };
}

function createSignature(data) {
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    return sign.sign(privateKey, 'hex');
}

app.get('/', (req, res) => {
    const sessionId = crypto.randomUUID();
    const serverPrivateKey = generatePrivateKey();
    const serverPublicKey = calculatePublicKey(serverPrivateKey);

    console.log('Сгенерирован приватный ключ сервера: ' + serverPrivateKey);
    console.log('Вычислен публичный ключ сервера: ' + serverPublicKey);

    sessions.set(sessionId, {
        serverPrivateKey,
        serverPublicKey,
        state: 'initiated',
        timestamp: Date.now(),
    });

    res.json({
        sessionId,
        prime: prime.toString(),
        generator: generator.toString(),
        serverPublicKey: serverPublicKey.toString(),
        publicKey: publicKey.export({ type: 'spki', format: 'pem' }),
        message: 'Инициирована схема Диффи-Хеллмана. Отправьте свой публичный ключ на /exchange.',
    });
});

app.get('/exchange', (req, res) => {
    const { sessionId, clientPublicKey } = req.query;

    if (!sessionId || !clientPublicKey) {
        return res.status(409).json({ error: 'Отсутствуют необходимые параметры' });
    }

    const session = sessions.get(sessionId);
    if (!session) {
        return res.status(409).json({ error: 'Сессия не найдена' });
    }

    if (session.state !== 'initiated') {
        return res.status(409).json({ error: 'Нарушение схемы обмена данными' });
    }

    try {
        const clientPublicKeyBigInt = BigInt(clientPublicKey);
        if (clientPublicKeyBigInt <= BigInt(1) || clientPublicKeyBigInt >= prime - BigInt(1)) {
            return res.status(409).json({ error: 'Недействительный публичный ключ клиента' });
        }

        const sharedSecret = powerMod(clientPublicKeyBigInt, session.serverPrivateKey, prime);
        console.log(`Вычислен общий секрет: ${sharedSecret}`);
        const sessionKey = createSessionKeyFromSecret(sharedSecret);

        session.sharedSecret = sharedSecret;
        session.sessionKey = sessionKey;
        session.state = 'established';

        res.json({
            message: 'Ключ успешно установлен',
            status: 'success',
        });
    } catch (error) {
        console.error('Ошибка при обмене ключами:', error);
        return res.status(409).json({ error: 'Нарушение схемы обмена данными' });
    }
});

app.get('/resource', (req, res) => {
    const { sessionId } = req.query;

    if (!sessionId) {
        return res.status(409).json({ error: 'Отсутствуют необходимые параметры' });
    }

    const session = sessions.get(sessionId);
    if (!session) {
        return res.status(409).json({ error: 'Сессия не найдена' });
    }

    if (session.state !== 'established') {
        return res.status(409).json({ error: 'Сеансовый ключ не установлен' });
    }

    try {
        const fileContent = `${student.surname} ${student.firstname} ${student.middlename}`;
        const signature = createSignature(fileContent); // Создаем цифровую подпись
        console.log(`Создана цифровая подпись: ${signature}`); // Выводим подпись
        const dataToEncrypt = JSON.stringify({ content: fileContent, signature });

        const encryptedData = encryptData(dataToEncrypt, session.sessionKey);

        res.json({
            iv: encryptedData.iv,
            encryptedData: encryptedData.encryptedData,
        });
    } catch (error) {
        console.error('Ошибка при отправке ресурса:', error);
        return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

setInterval(() => {
    const now = Date.now();
    for (const [sessionId, session] of sessions.entries()) {
        if (now - session.timestamp > 10 * 60 * 1000) {
            sessions.delete(sessionId);
        }
    }
}, 10 * 60 * 1000);

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});