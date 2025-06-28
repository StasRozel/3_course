const { ipcRenderer } = require('electron');

class SteganographyApp {
    constructor() {
        this.selectedImagePath1 = null;
        this.selectedImagePath2 = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Переключение вкладок
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // Загрузка изображений
        this.setupImageUpload('uploadArea1', 'imageInput1', 1);
        this.setupImageUpload('uploadArea2', 'imageInput2', 2);

        // Кнопки действий
        document.getElementById('encryptBtn').addEventListener('click', () => this.encryptMessage());
        document.getElementById('decryptBtn').addEventListener('click', () => this.decryptMessage());

        // Проверка ввода сообщения
        document.getElementById('messageInput').addEventListener('input', () => {
            this.updateEncryptButton();
        });
    }

    switchTab(tabName) {
        // Обновляем активную вкладку
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Показываем соответствующий контент
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }

    setupImageUpload(uploadAreaId, inputId, number) {
        const uploadArea = document.getElementById(uploadAreaId);
        const fileInput = document.getElementById(inputId);

        // Клик по области загрузки
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // Изменение файла
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleImageFile(file, number);
            }
        });

        // Drag & Drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.handleImageFile(files[0], number);
            }
        });
    }

    async handleImageFile(file, number) {
        try {
            // Создаем временный путь к файлу
            const tempPath = await this.saveTemporaryFile(file);
            
            if (number === 1) {
                this.selectedImagePath1 = tempPath;
            } else {
                this.selectedImagePath2 = tempPath;
            }

            // Показываем превью
            this.showImagePreview(file, number);
            
            // Обновляем состояние кнопок
            this.updateButtons();
            
        } catch (error) {
            this.showStatus(number === 1 ? 'encryptStatus' : 'decryptStatus', 
                          `Ошибка загрузки изображения: ${error.message}`, 'error');
        }
    }

    async saveTemporaryFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const buffer = Buffer.from(e.target.result);
                    const path = require('path');
                    const os = require('os');
                    const fs = require('fs');
                    
                    const tempPath = path.join(os.tmpdir(), `steganography_${Date.now()}_${file.name}`);
                    fs.writeFileSync(tempPath, buffer);
                    resolve(tempPath);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
            reader.readAsArrayBuffer(file);
        });
    }

    showImagePreview(file, number) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewDiv = document.getElementById(`imagePreview${number}`);
            const previewImg = document.getElementById(`previewImg${number}`);
            const imageInfo = document.getElementById(`imageInfo${number}`);
            
            previewImg.src = e.target.result;
            imageInfo.textContent = `${file.name} (${this.formatFileSize(file.size)})`;
            previewDiv.style.display = 'block';
            previewDiv.classList.add('fade-in');
        };
        reader.readAsDataURL(file);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    updateButtons() {
        this.updateEncryptButton();
        this.updateDecryptButton();
    }

    updateEncryptButton() {
        const encryptBtn = document.getElementById('encryptBtn');
        const message = document.getElementById('messageInput').value.trim();
        encryptBtn.disabled = !this.selectedImagePath1 || !message;
    }

    updateDecryptButton() {
        const decryptBtn = document.getElementById('decryptBtn');
        decryptBtn.disabled = !this.selectedImagePath2;
    }

    async encryptMessage() {
        const message = document.getElementById('messageInput').value.trim();
        if (!this.selectedImagePath1 || !message) return;

        try {
            this.showProgress('encryptProgress', 'encryptProgressBar');
            this.showStatus('encryptStatus', 'Шифрование сообщения...', 'info');
            
            const result = await ipcRenderer.invoke('process-image', this.selectedImagePath1, message, true);
            
            if (result.success) {
                // Сохраняем зашифрованное изображение
                const defaultName = `encrypted_${Date.now()}.png`;
                const savedPath = await ipcRenderer.invoke('save-image', result.data, defaultName);
                
                if (savedPath) {
                    this.showStatus('encryptStatus', 
                        `✅ Сообщение успешно зашифровано и сохранено в: ${savedPath}`, 'success');
                } else {
                    this.showStatus('encryptStatus', '❌ Отменено пользователем', 'info');
                }
            } else {
                this.showStatus('encryptStatus', `❌ Ошибка шифрования: ${result.error}`, 'error');
            }
            
        } catch (error) {
            this.showStatus('encryptStatus', `❌ Ошибка: ${error.message}`, 'error');
        } finally {
            this.hideProgress('encryptProgress');
        }
    }

    async decryptMessage() {
        if (!this.selectedImagePath2) return;

        try {
            this.showProgress('decryptProgress', 'decryptProgressBar');
            this.showStatus('decryptStatus', 'Расшифровка сообщения...', 'info');
            
            const result = await ipcRenderer.invoke('process-image', this.selectedImagePath2, null, false);
            
            if (result.success) {
                const messageDiv = document.getElementById('decryptedMessage');
                const messageResult = document.getElementById('messageResult');
                
                messageResult.textContent = result.message;
                messageDiv.style.display = 'block';
                messageDiv.classList.add('fade-in');
                
                this.showStatus('decryptStatus', '✅ Сообщение успешно расшифровано!', 'success');
            } else {
                this.showStatus('decryptStatus', `❌ Ошибка расшифровки: ${result.error}`, 'error');
                document.getElementById('decryptedMessage').style.display = 'none';
            }
            
        } catch (error) {
            this.showStatus('decryptStatus', `❌ Ошибка: ${error.message}`, 'error');
            document.getElementById('decryptedMessage').style.display = 'none';
        } finally {
            this.hideProgress('decryptProgress');
        }
    }

    showProgress(progressId, barId) {
        const progressDiv = document.getElementById(progressId);
        const progressBar = document.getElementById(barId);
        
        progressDiv.style.display = 'block';
        progressBar.style.width = '0%';
        
        // Анимация прогресса
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;
            progressBar.style.width = progress + '%';
        }, 100);
        
        progressDiv.dataset.interval = interval;
    }

    hideProgress(progressId) {
        const progressDiv = document.getElementById(progressId);
        const interval = progressDiv.dataset.interval;
        
        if (interval) {
            clearInterval(interval);
        }
        
        // Завершаем прогресс
        const progressBar = progressDiv.querySelector('.progress-bar');
        progressBar.style.width = '100%';
        
        setTimeout(() => {
            progressDiv.style.display = 'none';
        }, 500);
    }

    showStatus(statusId, message, type) {
        const statusDiv = document.getElementById(statusId);
        statusDiv.innerHTML = message;
        statusDiv.className = `status ${type}`;
        statusDiv.style.display = 'block';
        statusDiv.classList.add('fade-in');
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new SteganographyApp();
});

// Обработка ошибок
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});