const express = require('express');
const fs = require('fs');
const path = require('path');
const { notifyClients } = require('../websocket');

const router = express.Router();
const backupsDir = path.join(__dirname, '../data/backups/');

if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir);

router.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '');
  const backupFileName = `${timestamp}_StudentList.json`;
  const backupFilePath = path.join(backupsDir, backupFileName);

  setTimeout(() => {
    fs.copyFileSync(path.join(__dirname, '../data/StudentList.json'), backupFilePath);
    notifyClients({ message: 'Backup created', file: backupFileName });
    res.json({ message: 'Backup created', file: backupFileName });
  }, 2000);
});

router.get('/', (req, res) => {
  const backups = fs.readdirSync(backupsDir).filter(file => file.endsWith('.json'));
  res.json(backups);
});

router.delete('/:date', (req, res) => {
  const cutoffDate = req.params.date;

  const backups = fs.readdirSync(backupsDir);
  const removedBackups = backups.filter(file => file < `${cutoffDate}_StudentList.json`);

  removedBackups.forEach(file => {
    fs.unlinkSync(path.join(backupsDir, file));
  });

  res.json({ removed: removedBackups });
});

function watchFolder(folderPath, onChangeCallback) {
  try {
    if (!fs.existsSync(folderPath)) {
      throw new Error(`Папка "${folderPath}" не существует.`);
    }

    console.log(`Начинаем отслеживать папку: ${folderPath}`);

    fs.watch(folderPath, (eventType, filename) => {
      if (filename) {
        const fullPath = path.join(folderPath, filename);
        onChangeCallback(eventType, fullPath);
      } else {
        console.warn('Изменения произошли, но имя файла не определено.');
      }
    });
  } catch (error) {
    console.error(`Ошибка при отслеживании папки: ${error.message}`);
  }
}

const folderToWatch = './data/';
watchFolder(folderToWatch, (eventType, filePath) => {
  notifyClients({ message: 'Change file', event: eventType, path: filePath });
});

module.exports = router;
