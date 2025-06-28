const BASE_URL = 'http://localhost:3000';

// Вспомогательная функция для отображения ответа
function displayResponse(elementId, message, isError = false) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.className = isError ? 'error' : 'response';
}

// Создание директории
async function createDirectory() {
  const dirPath = document.getElementById('createDirPath').value;
  if (!dirPath) {
    displayResponse('createDirResponse', 'Please enter a directory path', true);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/md/${encodeURIComponent(dirPath)}`, {
      method: 'POST'
    });
    const result = await response.json();
    if (response.status === 408) {
      displayResponse('createDirResponse', result.message, true);
    } else if (response.ok) {
      displayResponse('createDirResponse', result.message);
    } else {
      displayResponse('createDirResponse', result.message || 'Failed to create directory', true);
    }
  } catch (error) {
    displayResponse('createDirResponse', 'Error: ' + error.message, true);
  }
}

// Удаление директории
async function removeDirectory() {
  const dirPath = document.getElementById('removeDirPath').value;
  if (!dirPath) {
    displayResponse('removeDirResponse', 'Please enter a directory path', true);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/rd/${encodeURIComponent(dirPath)}`, {
      method: 'POST'
    });
    const result = await response.json();
    if (response.status === 408) {
      displayResponse('removeDirResponse', result.message, true);
    } else if (response.ok) {
      displayResponse('removeDirResponse', result.message);
    } else {
      displayResponse('removeDirResponse', result.message || 'Failed to remove directory', true);
    }
  } catch (error) {
    displayResponse('removeDirResponse', 'Error: ' + error.message, true);
  }
}

// Загрузка файла
async function uploadFile() {
  const filePath = document.getElementById('uploadFilePath').value;
  const fileInput = document.getElementById('uploadFile');
  if (!filePath || !fileInput.files[0]) {
    displayResponse('uploadFileResponse', 'Please enter a file path and select a file', true);
    return;
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  try {
    const response = await fetch(`${BASE_URL}/up/${encodeURIComponent(filePath)}`, {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    if (response.status === 408) {
      displayResponse('uploadFileResponse', result.message, true);
    } else if (response.ok) {
      displayResponse('uploadFileResponse', result.message);
    } else {
      displayResponse('uploadFileResponse', result.message || 'Failed to upload file', true);
    }
  } catch (error) {
    displayResponse('uploadFileResponse', 'Error: ' + error.message, true);
  }
}

// Скачивание файла
async function downloadFile() {
  const filePath = document.getElementById('downloadFilePath').value;
  if (!filePath) {
    displayResponse('downloadFileResponse', 'Please enter a file path', true);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/down/${encodeURIComponent(filePath)}`, {
      method: 'POST'
    });
    if (response.status === 404) {
      const result = await response.json();
      displayResponse('downloadFileResponse', result.message, true);
      return;
    }
    if (!response.ok) {
      const result = await response.json();
      displayResponse('downloadFileResponse', result.message || 'Failed to download file', true);
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filePath.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    displayResponse('downloadFileResponse', 'File downloaded successfully');
  } catch (error) {
    displayResponse('downloadFileResponse', 'Error: ' + error.message, true);
  }
}

// Удаление файла
async function deleteFile() {
  const filePath = document.getElementById('deleteFilePath').value;
  if (!filePath) {
    displayResponse('deleteFileResponse', 'Please enter a file path', true);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/del/${encodeURIComponent(filePath)}`, {
      method: 'POST'
    });
    const result = await response.json();
    if (response.status === 404) {
      displayResponse('deleteFileResponse', result.message, true);
    } else if (response.ok) {
      displayResponse('deleteFileResponse', result.message);
    } else {
      displayResponse('deleteFileResponse', result.message || 'Failed to delete file', true);
    }
  } catch (error) {
    displayResponse('deleteFileResponse', 'Error: ' + error.message, true);
  }
}

// Копирование файла
async function copyFile() {
  const sourcePath = document.getElementById('copySourcePath').value;
  const destPath = document.getElementById('copyDestPath').value;
  if (!sourcePath || !destPath) {
    displayResponse('copyFileResponse', 'Please enter both source and destination paths', true);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/copy/${encodeURIComponent(sourcePath)}/${encodeURIComponent(destPath)}`, {
      method: 'POST'
    });
    const result = await response.json();
    if (response.status === 404 || response.status === 408) {
      displayResponse('copyFileResponse', result.message, true);
    } else if (response.ok) {
      displayResponse('copyFileResponse', result.message);
    } else {
      displayResponse('copyFileResponse', result.message || 'Failed to copy file', true);
    }
  } catch (error) {
    displayResponse('copyFileResponse', 'Error: ' + error.message, true);
  }
}

// Перемещение файла
async function moveFile() {
  const sourcePath = document.getElementById('moveSourcePath').value;
  const destPath = document.getElementById('moveDestPath').value;
  if (!sourcePath || !destPath) {
    displayResponse('moveFileResponse', 'Please enter both source and destination paths', true);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/move/${encodeURIComponent(sourcePath)}/${encodeURIComponent(destPath)}`, {
      method: 'POST'
    });
    const result = await response.json();
    if (response.status === 404 || response.status === 408) {
      displayResponse('moveFileResponse', result.message, true);
    } else if (response.ok) {
      displayResponse('moveFileResponse', result.message);
    } else {
      displayResponse('moveFileResponse', result.message || 'Failed to move file', true);
    }
  } catch (error) {
    displayResponse('moveFileResponse', 'Error: ' + error.message, true);
  }
}