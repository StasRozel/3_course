import fs from 'fs';
import path from 'path';
import { client } from './webdav.spec.js'

async function exists(path) {
    try {
        await client.stat(path);
        return true;
    } catch (error) {
        return false;
    }
}

export async function createDirectoryRecursive(dirPath) {
    const parts = dirPath.split('/').filter(part => part);
    let currentPath = '';
    
    for (const part of parts) {
        currentPath += '/' + part;
        if (!(await exists(currentPath))) {
            try {
                await client.createDirectory(currentPath);
                console.log(`Создана директория: ${currentPath}`);
            } catch (error) {
                if (error.status === 409) { // Игнорируем ошибку, если директория уже существует
                    return 408;
                }
            }
        }
    }
}

export async function createDirectory(dirPath) {
    try {
        return await createDirectoryRecursive(dirPath);
    } catch (error) {
        console.error('Ошибка при создании папки:', error);
    }
}

export async function uploadFile(localPath, remotePath) {
    try {
        const remoteDir = path.dirname(remotePath);
        await createDirectoryRecursive(remoteDir);

        if (await exists(remotePath)) {
            console.log(`Файл ${remotePath} уже существует. Перезаписываем...`);
        }

        const readStream = fs.createReadStream(localPath);
        await client.putFileContents(remotePath, readStream, { overwrite: true });
        console.log(`Файл ${localPath} успешно загружен как ${remotePath}`);
    } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
        throw error;
    }
}

export async function downloadFile(remotePath, localPath) {
    try {
        if (!(await exists(remotePath))) {
            throw new Error(`Файл ${remotePath} не существует на сервере`);
        }

        const readStream = await client.createReadStream(remotePath);
        const writeStream = fs.createWriteStream(localPath);
        
        return new Promise((resolve, reject) => {
            readStream.pipe(writeStream);
            writeStream.on('finish', () => {
                console.log(`Файл ${remotePath} успешно скачан как ${localPath}`);
                resolve();
            });
            writeStream.on('error', reject);
        });
    } catch (error) {
        console.error('Ошибка при скачивании файла:', error);
        throw error;
    }
}

export async function copyFile(sourcePath, destinationPath) {
    try {
        if (!(await exists(sourcePath))) {
            throw new Error(`Исходный файл ${sourcePath} не существует`);
        }

        const destDir = path.dirname(destinationPath);
        await createDirectoryRecursive(destDir);

        await client.copyFile(sourcePath, destinationPath);
        console.log(`Файл скопирован из ${sourcePath} в ${destinationPath}`);
    } catch (error) {
        console.error('Ошибка при копировании файла:', error);
        throw error;
    }
}

export async function deleteFile(filePath) {
    try {
        if (!(await exists(filePath))) {
            console.log(`Файл ${filePath} не существует`);
            return;
        }

        await client.deleteFile(filePath);
        console.log(`Файл ${filePath} успешно удален`);
    } catch (error) {
        console.error('Ошибка при удалении файла:', error);
        throw error;
    }
}

export async function deleteDirectory(dirPath) {
    try {
        if (!(await exists(dirPath))) {
            console.log(`Папка ${dirPath} не существует`);
            return;
        }

        await client.deleteFile(dirPath);
        console.log(`Папка ${dirPath} успешно удалена`);
    } catch (error) {
        console.error('Ошибка при удалении папки:', error);
        throw error;
    }
}