import { createClient } from 'webdav';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const client = createClient(
    'https://webdav.yandex.ru/', 
    {
        username: 'stasrozel', 
        password: 'pjdnesqhyzbvyusl' 
    }
);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function exists(path) {
    try {
        await client.stat(path);
        return true;
    } catch (error) {
        return false;
    }
}

async function createDirectoryRecursive(dirPath) {
    const parts = dirPath.split('/').filter(part => part);
    let currentPath = '';
    
    for (const part of parts) {
        currentPath += '/' + part;
        if (!(await exists(currentPath))) {
            try {
                await client.createDirectory(currentPath);
                console.log(`Создана директория: ${currentPath}`);
            } catch (error) {
                if (error.status !== 409) { // Игнорируем ошибку, если директория уже существует
                    throw error;
                }
            }
        }
    }
}

async function createDirectory(dirPath) {
    try {
        await createDirectoryRecursive(dirPath);
        console.log(`Папка ${dirPath} успешно создана`);
    } catch (error) {
        console.error('Ошибка при создании папки:', error);
    }
}

async function uploadFile(localPath, remotePath) {
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

async function downloadFile(remotePath, localPath) {
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

async function copyFile(sourcePath, destinationPath) {
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

async function deleteFile(filePath) {
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

async function deleteDirectory(dirPath) {
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

async function showMenu() {
    while (true) {
        console.log('\n|=== |Меню| ===|');
        console.log('1. |Создать папку|');
        console.log('2. |Загрузить файл|');
        console.log('3. |Скачать файл|');
        console.log('4. |Копировать файл|');
        console.log('5. |Удалить файл|');
        console.log('6. |Удалить папку|');
        console.log('0. |Выход|');
        
        const choice = await question('Выберите действие (0-6): ');
        
        switch (choice) {
            case '1':
                const dirPath = await question('Введите путь для новой папки: ');
                await createDirectory(dirPath);
                break;
                
            case '2':
                const localPathUpload = await question('Введите путь к локальному файлу: ');
                const remotePathUpload = await question('Введите путь для загрузки на сервер: ');
                await uploadFile(localPathUpload, remotePathUpload);
                break;
                
            case '3':
                const remotePathDownload = await question('Введите путь к файлу на сервере: ');
                const localPathDownload = await question('Введите путь для сохранения: ');
                await downloadFile(remotePathDownload, localPathDownload);
                break;
                
            case '4':
                const sourcePath = await question('Введите путь к исходному файлу: ');
                const destPath = await question('Введите путь назначения: ');
                await copyFile(sourcePath, destPath);
                break;
                
            case '5':
                const fileToDelete = await question('Введите путь к файлу для удаления: ');
                await deleteFile(fileToDelete);
                break;
                
            case '6':
                const dirToDelete = await question('Введите путь к папке для удаления: ');
                await deleteDirectory(dirToDelete);
                break;
                
            case '0':
                console.log('Программа завершена');
                rl.close();
                return;
                
            default:
                console.log('Неверный выбор. Попробуйте снова.');
        }
    }
}

showMenu().catch(console.error);