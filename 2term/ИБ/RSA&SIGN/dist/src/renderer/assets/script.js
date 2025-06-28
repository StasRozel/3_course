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

// Key pair storage
let myKeyPair = null;

// Generate keys
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

// Encrypt and sign message - update this function
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

        encryptedMessageTextarea.value = encryptResult.encrypted;
        signatureTextarea.value = signResult.signature;

    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Fixed version of decryptAndVerifyButton event listener
decryptAndVerifyButton.addEventListener('click', async () => {
    const encryptedMessage = receivedEncryptedTextarea.value;
    const signature = receivedSignatureTextarea.value; // Don't parse as integer
    const senderPublicKey = JSON.parse(recipientPublicKeyTextarea.value || '[]');

    if (!encryptedMessage) {
        alert('Please enter an encrypted message');
        return;
    }

    if (!signature) {
        alert('Please enter a signature');
        return;
    }

    if (!senderPublicKey || senderPublicKey.length !== 2) {
        alert('Please enter a valid sender public key');
        return;
    }

    if (!myKeyPair) {
        alert('Please generate your keys first');
        return;
    }

    try {
        // Decrypt with your private key
        const decryptResult = await ipcRenderer.invoke('decrypt', encryptedMessage, myKeyPair.privateKey);
        if (!decryptResult.success) {
            throw new Error('Decryption failed: ' + decryptResult.error);
        }

        // Verify with sender's public key
        const verifyResult = await ipcRenderer.invoke('verify', decryptResult.decrypted, signature, senderPublicKey);
        if (!verifyResult.success) {
            throw new Error('Verification failed: ' + verifyResult.error);
        }

        decryptedMessageDiv.textContent = decryptResult.decrypted;

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

// Элементы
const notificationBox = document.createElement('div');
notificationBox.style.position = 'fixed';
notificationBox.style.bottom = '20px';
notificationBox.style.left = '50%';
notificationBox.style.transform = 'translateX(-50%)';
notificationBox.style.backgroundColor = '#45a049';
notificationBox.style.color = 'white';
notificationBox.style.padding = '10px 20px';
notificationBox.style.borderRadius = '6px';
notificationBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
notificationBox.style.fontSize = '14px';
notificationBox.style.zIndex = '1000';
notificationBox.style.display = 'none';
document.body.appendChild(notificationBox);

function showNotification(message) {
    notificationBox.textContent = message;
    notificationBox.style.display = 'block';
    setTimeout(() => {
        notificationBox.style.display = 'none';
    }, 2000);
}

copyPublicKeyButton.addEventListener('click', () => {
    myPublicKeyTextarea.select();
    document.execCommand('copy');
    showNotification('Публичный ключ скопирован в буфер обмена');
});

copyEncryptedButton.addEventListener('click', () => {
    encryptedMessageTextarea.select();
    document.execCommand('copy');
    showNotification('Зашифрованное сообщение скопировано');
});

copySignatureButton.addEventListener('click', () => {
    signatureTextarea.select();
    document.execCommand('copy');
    showNotification('Подпись скопирована');
});