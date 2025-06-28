import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { generateRSAKeyPair } from './src/rsa/rsa';
import { encryptMessage } from './src/rsa/encrypt';
import { decryptMessage } from './src/rsa/decrypt';
import { signMessage } from './src/rsa/sign';
import { verifySignature } from './src/rsa/verify';

let mainWindow: BrowserWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, './src/renderer/index.html'));
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle('generate-keys', async (_, bits: number) => {
    try {
        const keyPair = generateRSAKeyPair(bits);
        return { success: true, keyPair };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('encrypt', async (_, message: string, publicKey: [string, string]) => {
    try {
        const bigintPublicKey: [bigint, bigint] = [BigInt(publicKey[0]), BigInt(publicKey[1])];
        const n = bigintPublicKey[1];

        const keyByteSize = Math.floor(n.toString(2).length / 8);
        const maxChunkSize = Math.max(1, keyByteSize - 11); // RSA PKCS#1 requires padding

        const chunks: string[] = [];
        for (let i = 0; i < message.length; i += maxChunkSize) {
            chunks.push(message.substring(i, i + maxChunkSize));
        }

        const encryptedChunks = chunks.map(chunk => {
            return encryptMessage(chunk, bigintPublicKey).toString();
        });

        return {
            success: true,
            encrypted: JSON.stringify(encryptedChunks)
        };
    } catch (error) {
        console.error("Encryption error:", error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('decrypt', async (_, encryptedStr: string, privateKey: [string, string]) => {
    try {
        const bigintPrivateKey: [bigint, bigint] = [BigInt(privateKey[0]), BigInt(privateKey[1])];

        const encryptedChunks = JSON.parse(encryptedStr);

        if (!Array.isArray(encryptedChunks)) {
            const decrypted = decryptMessage(BigInt(encryptedStr), bigintPrivateKey);
            return { success: true, decrypted };
        }

        const decryptedChunks = encryptedChunks.map(chunk => {
            return decryptMessage(BigInt(chunk), bigintPrivateKey);
        });

        return { success: true, decrypted: decryptedChunks.join('') };
    } catch (error) {
        console.error("Decryption error:", error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('sign', async (_, message: string, privateKey: [string, string]) => {
    try {
        console.log("Signing message:", message); 
        const bigintPrivateKey: [bigint, bigint] = [BigInt(privateKey[0]), BigInt(privateKey[1])];
        const signature = signMessage(message, bigintPrivateKey);
        console.log("Generated signature:", signature.toString().substring(0, 30) + "...");
        return { success: true, signature: signature.toString() };
    } catch (error) {
        console.error("Signing error:", error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('verify', async (_, message: string, signatureStr: string, publicKey: [string, string]) => {
    try {
        console.log("Verifying message:", message);
        console.log("With signature:", signatureStr.substring(0, 30) + "...");
        const bigintPublicKey: [bigint, bigint] = [BigInt(publicKey[0]), BigInt(publicKey[1])];
        const signature = BigInt(signatureStr);
        
        // Пытаемся проверить подпись
        const isValid = verifySignature(message, signature, bigintPublicKey);
        console.log("Signature verification result:", isValid);
        
        return { success: true, isValid };
    } catch (error) {
        console.error("Verification error:", error);
        return { success: false, error: error.message };
    }
});