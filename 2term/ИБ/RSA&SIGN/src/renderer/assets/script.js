const { ipcRenderer } = require('electron');

const keyBitsSelect = document.getElementById('keyBits');
const generateKeysButton = document.getElementById('generateKeys');
const myPublicKeyTextarea = document.getElementById('myPublicKey');
const myPrivateKeyTextarea = document.getElementById('myPrivateKey');
const recipientPublicKeyTextarea = document.getElementById('recipientPublicKey');
const messageToSendInput = document.getElementById('messageToSend');
const encryptAndSignButton = document.getElementById('encryptAndSign');
const encryptedMessageTextarea = document.getElementById('encryptedMessage');
const signatureTextarea = document.getElementById('signature');
const receivedEncryptedTextarea = document.getElementById('receivedEncrypted');
const receivedSignatureTextarea = document.getElementById('receivedSignature');
const decryptAndVerifyButton = document.getElementById('decryptAndVerify');
const decryptedMessageDiv = document.getElementById('decryptedMessage');
const verificationResultDiv = document.getElementById('verificationResult');
const copyPublicKeyButton = document.getElementById('copyPublicKey');
const copyEncryptedButton = document.getElementById('copyEncrypted');
const copySignatureButton = document.getElementById('copySignature');

let myKeyPair = null;

generateKeysButton.addEventListener('click', async () => {
    const bits = parseInt(keyBitsSelect.value);
    generateKeysButton.disabled = true;
    generateKeysButton.textContent = 'Generating...';

    try {
        const result = await ipcRenderer.invoke('generate-keys', bits);
        if (result.success) {
            myKeyPair = result.keyPair;
            myPublicKeyTextarea.value = JSON.stringify(myKeyPair.publicKey);
            myPrivateKeyTextarea.value = JSON.stringify(myKeyPair.privateKey);
        } else {
            alert('Error generating keys: ' + result.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        generateKeysButton.disabled = false;
        generateKeysButton.textContent = 'Generate Keys';
    }
});

// Encrypt and sign message
encryptAndSignButton.addEventListener('click', async () => {
    const message = messageToSendInput.value;
    const recipientPublicKey = JSON.parse(recipientPublicKeyTextarea.value || '[]');

    if (!message) {
        alert('Please enter a message');
        return;
    }

    if (!recipientPublicKey || recipientPublicKey.length !== 2) {
        alert('Please enter a valid recipient public key');
        return;
    }

    if (!myKeyPair) {
        alert('Please generate your keys first');
        return;
    }

    try {
        // Encrypt with recipient's public key
        const encryptResult = await ipcRenderer.invoke('encrypt', message, recipientPublicKey);
        if (!encryptResult.success) {
            throw new Error('Encryption failed: ' + encryptResult.error);
        }

        // Sign with your private key
        const signResult = await ipcRenderer.invoke('sign', message, myKeyPair.privateKey);
        if (!signResult.success) {
            throw new Error('Signing failed: ' + signResult.error);
        }

        // Сохраняем зашифрованное сообщение
        encryptedMessageTextarea.value = encryptResult.encrypted;
        
        // Создаём пакет подписи, включающий оригинальное сообщение и подпись
        const signaturePackage = {
            originalMessage: message,
            signature: signResult.signature,
            publicKey: myKeyPair.publicKey  // Важно! Добавляем публичный ключ отправителя для проверки
        };
        
        // Сохраняем пакет подписи
        signatureTextarea.value = JSON.stringify(signaturePackage);

    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Fixed version of decryptAndVerifyButton event listener
decryptAndVerifyButton.addEventListener('click', async () => {
    try {
        const encryptedMessage = receivedEncryptedTextarea.value;
        let signatureData;
        
        try {
            // Пытаемся распарсить данные подписи как JSON
            signatureData = JSON.parse(receivedSignatureTextarea.value);
        } catch (e) {
            alert('Invalid signature format. Please use the new signature format.');
            return;
        }
        
        // Проверяем, что пакет подписи корректный
        if (!signatureData.signature || !signatureData.originalMessage || !signatureData.publicKey) {
            alert('Invalid signature package format');
            return;
        }
        
        const signature = signatureData.signature;
        const originalMessage = signatureData.originalMessage;
        const senderPublicKey = signatureData.publicKey; // Теперь берём публичный ключ из пакета подписи

        if (!encryptedMessage) {
            alert('Please enter an encrypted message');
            return;
        }

        if (!signature) {
            alert('Please enter a signature');
            return;
        }

        if (!myKeyPair) {
            alert('Please generate your keys first');
            return;
        }

        // Расшифровываем сообщение своим приватным ключом
        const decryptResult = await ipcRenderer.invoke('decrypt', encryptedMessage, myKeyPair.privateKey);
        if (!decryptResult.success) {
            throw new Error('Decryption failed: ' + decryptResult.error);
        }

        // Отображаем расшифрованное сообщение
        decryptedMessageDiv.textContent = decryptResult.decrypted;

        // Проверяем подпись с оригинальным сообщением и публичным ключом отправителя
        const verifyResult = await ipcRenderer.invoke('verify', originalMessage, signature, senderPublicKey);
        if (!verifyResult.success) {
            throw new Error('Verification failed: ' + verifyResult.error);
        }

        if (verifyResult.isValid) {
            verificationResultDiv.textContent = 'Signature is valid ✓';
            verificationResultDiv.style.color = 'green';
        } else {
            verificationResultDiv.textContent = 'Signature is invalid ✗';
            verificationResultDiv.style.color = 'red';
        }
    } catch (error) {
        alert('Error: ' + error.message);
        console.error('Decryption/verification error:', error);
    }
});

copyPublicKeyButton.addEventListener('click', () => {
    myPublicKeyTextarea.select();
    document.execCommand('copy');
    alert('Public key copied to clipboard');
});

copyEncryptedButton.addEventListener('click', () => {
    encryptedMessageTextarea.select();
    document.execCommand('copy');
    alert('Encrypted message copied to clipboard');
});

copySignatureButton.addEventListener('click', () => {
    signatureTextarea.select();
    document.execCommand('copy');
    alert('Signature copied to clipboard');
});