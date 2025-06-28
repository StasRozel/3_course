const fs = require('fs');
const path = require('path');

// Путь к файлу calc.wasm
const wasmFilePath = path.join(__dirname, 'calc.wasm');

// Чтение файла как буфера
const buffer = fs.readFileSync(wasmFilePath);

// Преобразование буфера в Uint8Array
const uint8Array = new Uint8Array(buffer);

// Вывод массива в формате строки для JavaScript
console.log(`let wasmCode = new Uint8Array([${uint8Array}]);`);