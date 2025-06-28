import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createDirectory, uploadFile, downloadFile,  copyFile, deleteDirectory, deleteFile} from './webdav_fs.js'

const app = express();
const PORT = 3000;

// Настройка multer для обработки загружаемых файлов
const upload = multer({ dest: 'uploads/' });

// Создаем папку uploads, если она не существует
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Middleware для обработки JSON
app.use(express.json());
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile('/home/rozel/Документы/Универ/ПСКП/24/public/index.html');
})

// Эндпоинт: POST /md/:dirPath - Создать директорию
app.post('/md/:dirPath', async (req, res) => {
  try {
    const dirPath = req.params.dirPath;
    const result = await createDirectory(dirPath);
    if (result === 408) {
      return res.status(408).json({ message: `Directory ${dirPath} already exists` });
    }
    res.status(200).json({ message: `Directory ${dirPath} created successfully` });
  } catch (error) {
    console.error('Error creating directory:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Эндпоинт: POST /rd/:dirPath - Удалить директорию
app.post('/rd/:dirPath', async (req, res) => {
  try {
    const dirPath = req.params.dirPath;
    await deleteDirectory(dirPath);
    res.status(200).json({ message: `Directory ${dirPath} deleted successfully` });
  } catch (error) {
    if (error.message.includes('не существует')) {
      return res.status(408).json({ message: `Directory ${req.params.dirPath} does not exist` });
    }
    console.error('Error deleting directory:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Эндпоинт: POST /up/:fileName - Загрузить файл
app.post('/up/:fileName', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileName = req.params.fileName;
    const localPath = req.file.path;
    const remotePath = fileName;

    await uploadFile(localPath, remotePath);
    fs.unlinkSync(localPath); // Удаляем временный файл
    res.status(200).json({ message: `File ${fileName} uploaded successfully` });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(408).json({ message: 'Failed to upload file' });
  }
});

// Эндпоинт: POST /down/:fileName - Скачать файл
app.post('/down/:fileName', async (req, res) => {
  try {
    const fileName = req.params.fileName;
    const localPath = path.join('uploads', path.basename(fileName));

    await downloadFile(fileName, localPath);
    res.download(localPath, path.basename(fileName), (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ message: 'Error sending file' });
      }
      fs.unlinkSync(localPath); // Удаляем временный файл после отправки
    });
  } catch (error) {
    if (error.message.includes('не существует')) {
      return res.status(404).json({ message: `File ${req.params.fileName} not found` });
    }
    console.error('Error downloading file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Эндпоинт: POST /del/:fileName - Удалить файл
app.post('/del/:fileName', async (req, res) => {
  try {
    const fileName = req.params.fileName;
    await deleteFile(fileName);
    res.status(200).json({ message: `File ${fileName} deleted successfully` });
  } catch (error) {
    if (error.message.includes('не существует')) {
      return res.status(404).json({ message: `File ${req.params.fileName} not found` });
    }
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Эндпоинт: POST /copy/:fileName/:copyFilePath - Копировать файл
app.post('/copy/:fileName/:copyFilePath', async (req, res) => {
  try {
    const sourcePath = req.params.fileName;
    const destinationPath = req.params.copyFilePath;
    await copyFile(sourcePath, destinationPath);
    res.status(200).json({ message: `File copied from ${sourcePath} to ${destinationPath}` });
  } catch (error) {
    if (error.message.includes('не существует')) {
      return res.status(404).json({ message: `Source file ${req.params.fileName} not found` });
    }
    console.error('Error copying file:', error);
    res.status(408).json({ message: 'Failed to copy file' });
  }
});

// Эндпоинт: POST /move/:fileName/:moveFilePath - Переместить файл
app.post('/move/:fileName/:moveFilePath', async (req, res) => {
  try {
    const sourcePath = req.params.fileName;
    const destinationPath = req.params.moveFilePath;
    await copyFile(sourcePath, destinationPath); // Копируем файл
    await deleteFile(sourcePath); // Удаляем исходный файл
    res.status(200).json({ message: `File moved from ${sourcePath} to ${destinationPath}` });
  } catch (error) {
    if (error.message.includes('не существует')) {
      return res.status(404).json({ message: `Source file ${req.params.fileName} not found` });
    }
    console.error('Error moving file:', error);
    res.status(408).json({ message: 'Failed to move file' });
  }
});

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
})
