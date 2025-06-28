const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectImageFile: () => ipcRenderer.invoke('select-image-file'),
  saveImageFile: () => ipcRenderer.invoke('save-image-file'),
  encodeText: (imagePath, text, password) => ipcRenderer.invoke('encode-text', imagePath, text, password),
  decodeText: (imagePath, password) => ipcRenderer.invoke('decode-text', imagePath, password),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath)
});