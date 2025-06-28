"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const rsa_1 = require("./src/rsa/rsa");
const encrypt_1 = require("./src/rsa/encrypt");
const decrypt_1 = require("./src/rsa/decrypt");
const sign_1 = require("./src/rsa/sign");
const verify_1 = require("./src/rsa/verify");
let mainWindow;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadFile(path.join(__dirname, './src/renderer/index.html'));
}
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.ipcMain.handle('generate-keys', async (_, bits) => {
    try {
        const keyPair = (0, rsa_1.generateRSAKeyPair)(bits);
        return { success: true, keyPair };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
electron_1.ipcMain.handle('encrypt', async (_, message, publicKey) => {
    try {
        const bigintPublicKey = [BigInt(publicKey[0]), BigInt(publicKey[1])];
        const n = bigintPublicKey[1];
        const keyByteSize = Math.floor(n.toString(2).length / 8);
        const maxChunkSize = Math.max(1, keyByteSize - 11); // RSA PKCS#1 requires padding
        const chunks = [];
        for (let i = 0; i < message.length; i += maxChunkSize) {
            chunks.push(message.substring(i, i + maxChunkSize));
        }
        const encryptedChunks = chunks.map(chunk => {
            return (0, encrypt_1.encryptMessage)(chunk, bigintPublicKey).toString();
        });
        return {
            success: true,
            encrypted: JSON.stringify(encryptedChunks)
        };
    }
    catch (error) {
        console.error("Encryption error:", error);
        return { success: false, error: error.message };
    }
});
electron_1.ipcMain.handle('decrypt', async (_, encryptedStr, privateKey) => {
    try {
        const bigintPrivateKey = [BigInt(privateKey[0]), BigInt(privateKey[1])];
        const encryptedChunks = JSON.parse(encryptedStr);
        if (!Array.isArray(encryptedChunks)) {
            const decrypted = (0, decrypt_1.decryptMessage)(BigInt(encryptedStr), bigintPrivateKey);
            return { success: true, decrypted };
        }
        const decryptedChunks = encryptedChunks.map(chunk => {
            return (0, decrypt_1.decryptMessage)(BigInt(chunk), bigintPrivateKey);
        });
        return { success: true, decrypted: decryptedChunks.join('') };
    }
    catch (error) {
        console.error("Decryption error:", error);
        return { success: false, error: error.message };
    }
});
electron_1.ipcMain.handle('sign', async (_, message, privateKey) => {
    try {
        console.log("Signing message:", message);
        const bigintPrivateKey = [BigInt(privateKey[0]), BigInt(privateKey[1])];
        const signature = (0, sign_1.signMessage)(message, bigintPrivateKey);
        console.log("Generated signature:", signature.toString().substring(0, 30) + "...");
        return { success: true, signature: signature.toString() };
    }
    catch (error) {
        console.error("Signing error:", error);
        return { success: false, error: error.message };
    }
});
electron_1.ipcMain.handle('verify', async (_, message, signatureStr, publicKey) => {
    try {
        console.log("Verifying message:", message);
        console.log("With signature:", signatureStr.substring(0, 30) + "...");
        const bigintPublicKey = [BigInt(publicKey[0]), BigInt(publicKey[1])];
        const signature = BigInt(signatureStr);
        // Пытаемся проверить подпись
        const isValid = (0, verify_1.verifySignature)(message, signature, bigintPublicKey);
        console.log("Signature verification result:", isValid);
        return { success: true, isValid };
    }
    catch (error) {
        console.error("Verification error:", error);
        return { success: false, error: error.message };
    }
});
//# sourceMappingURL=index.js.map