const sharp = require('sharp');
const fs = require('fs');

class RationalSpline {
  constructor(points, weights = null) {
    this.points = points;
    this.weights = weights || new Array(points.length).fill(1);
    this.n = points.length - 1;
  }
  
  // Упрощенная функция оценки для стабильности
  evaluate(t) {
    if (this.points.length === 0) return 0;
    if (this.points.length === 1) return this.points[0];
    
    // Ограничиваем t в пределах [0, 1]
    t = Math.max(0, Math.min(1, t));
    
    // Используем линейную интерполяцию для стабильности
    const scaledT = t * (this.points.length - 1);
    const index = Math.floor(scaledT);
    const fraction = scaledT - index;
    
    if (index >= this.points.length - 1) {
      return this.points[this.points.length - 1];
    }
    
    const p1 = this.points[index];
    const p2 = this.points[index + 1];
    const w1 = this.weights[index];
    const w2 = this.weights[index + 1];
    
    // Рациональная интерполяция
    const numerator = w1 * p1 * (1 - fraction) + w2 * p2 * fraction;
    const denominator = w1 * (1 - fraction) + w2 * fraction;
    
    return denominator !== 0 ? numerator / denominator : p1;
  }
}

class MessageEncoder {
  // Преобразование сообщения в числовую последовательность
  static messageToNumbers(message) {
    const buffer = Buffer.from(message, 'utf8');
    return Array.from(buffer);
  }
  
  // Преобразование чисел обратно в сообщение
  static numbersToMessage(numbers) {
    const buffer = Buffer.from(numbers);
    return buffer.toString('utf8');
  }
  
  // Создание контрольных точек из сообщения
  static createControlPoints(message) {
    const numbers = this.messageToNumbers(message);
    const points = [];
    
    // Добавляем заголовок с длиной сообщения
    const lengthBytes = [(numbers.length >> 8) & 0xFF, numbers.length & 0xFF];
    const allNumbers = lengthBytes.concat(numbers);
    
    // Нормализуем значения к диапазону [0, 1]
    for (let i = 0; i < allNumbers.length; i++) {
      points.push(allNumbers[i] / 255.0);
    }
    
    return points;
  }
  
  // Извлечение сообщения из контрольных точек
  static extractMessage(points) {
    if (points.length < 2) return '';
    
    // Денормализуем значения
    const numbers = points.map(p => Math.round(p * 255));
    
    // Извлекаем длину сообщения
    const messageLength = (numbers[0] << 8) | numbers[1];
    
    if (messageLength <= 0 || messageLength > numbers.length - 2) {
      throw new Error('Invalid message length');
    }
    
    // Извлекаем сообщение
    const messageNumbers = numbers.slice(2, 2 + messageLength);
    return this.numbersToMessage(messageNumbers);
  }
}

async function encryptMessage(imagePath, message) {
  // Загружаем изображение
  const imageBuffer = fs.readFileSync(imagePath);
  const { data, info } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  const { width, height, channels } = info;
  
  // Преобразуем сообщение в биты
  const messageBytes = Buffer.from(message, 'utf8');
  const messageBits = [];
  
  // Добавляем длину сообщения (4 байта)
  const lengthBytes = Buffer.allocUnsafe(4);
  lengthBytes.writeUInt32BE(messageBytes.length, 0);
  
  // Преобразуем длину и сообщение в биты
  for (const byte of [...lengthBytes, ...messageBytes]) {
    for (let i = 7; i >= 0; i--) {
      messageBits.push((byte >> i) & 1);
    }
  }
  
  // Добавляем маркер конца (32 бита нулей)
  for (let i = 0; i < 32; i++) {
    messageBits.push(0);
  }
  
  if (messageBits.length > width * height * channels) {
    throw new Error('Message too long for this image');
  }
  
  // Создаем контрольные точки из битов сообщения
  const controlPoints = messageBits.map(bit => bit / 1.0);
  
  // Создаем рациональный сплайн
  const spline = new RationalSpline(controlPoints);
  
  // Модифицируем пиксели
  const modifiedData = Buffer.from(data);
  
  for (let i = 0; i < messageBits.length; i++) {
    if (i >= modifiedData.length) break;
    
    // Получаем значение из сплайна
    const t = i / Math.max(messageBits.length - 1, 1);
    const splineValue = spline.evaluate(t);
    
    // Определяем бит для встраивания на основе сплайна
    const bitToEmbed = splineValue > 0.5 ? 1 : 0;
    
    // Встраиваем бит в младший разряд пикселя
    const currentValue = modifiedData[i];
    modifiedData[i] = (currentValue & 0xFE) | bitToEmbed;
  }
  
  // Конвертируем в PNG
  const outputBuffer = await sharp(modifiedData, {
    raw: { width, height, channels }
  }).png().toBuffer();
  
  return outputBuffer;
}

async function decryptMessage(imagePath) {
  // Загружаем изображение
  const imageBuffer = fs.readFileSync(imagePath);
  const { data, info } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  const { width, height, channels } = info;
  
  // Извлекаем биты из младших разрядов пикселей
  const extractedBits = [];
  
  // Сначала извлекаем биты для длины сообщения (32 бита)
  for (let i = 0; i < Math.min(32, data.length); i++) {
    const bit = data[i] & 1;
    extractedBits.push(bit);
  }
  
  // Преобразуем первые 32 бита в длину сообщения
  if (extractedBits.length < 32) {
    throw new Error('Image too small to contain a message');
  }
  
  let messageLength = 0;
  for (let i = 0; i < 32; i++) {
    messageLength = (messageLength << 1) | extractedBits[i];
  }
  
  if (messageLength <= 0 || messageLength > 10000) {
    throw new Error('Invalid message length or no message found');
  }
  
  // Вычисляем общее количество битов для извлечения
  const totalBitsNeeded = 32 + (messageLength * 8) + 32; // длина + сообщение + маркер конца
  
  if (totalBitsNeeded > data.length) {
    throw new Error('Image too small for the expected message length');
  }
  
  // Извлекаем оставшиеся биты
  for (let i = 32; i < totalBitsNeeded && i < data.length; i++) {
    const bit = data[i] & 1;
    extractedBits.push(bit);
  }
  
  // Создаем контрольные точки из извлеченных битов
  const controlPoints = extractedBits.slice(0, totalBitsNeeded - 32).map(bit => bit / 1.0);
  
  // Создаем сплайн для проверки
  const spline = new RationalSpline(controlPoints);
  
  // Извлекаем биты сообщения (пропускаем первые 32 бита длины)
  const messageBits = [];
  
  for (let i = 32; i < 32 + (messageLength * 8) && i < extractedBits.length; i++) {
    // Получаем ожидаемое значение из сплайна
    const t = i / Math.max(totalBitsNeeded - 32 - 1, 1);
    const splineValue = spline.evaluate(t);
    const expectedBit = splineValue > 0.5 ? 1 : 0;
    
    // Используем извлеченный бит
    messageBits.push(extractedBits[i]);
  }
  
  // Преобразуем биты в байты
  const messageBytes = [];
  for (let i = 0; i < messageBits.length; i += 8) {
    if (i + 7 < messageBits.length) {
      let byte = 0;
      for (let j = 0; j < 8; j++) {
        byte = (byte << 1) | messageBits[i + j];
      }
      messageBytes.push(byte);
    }
  }
  
  if (messageBytes.length !== messageLength) {
    throw new Error('Message length mismatch');
  }
  
  // Преобразуем байты в строку
  const messageBuffer = Buffer.from(messageBytes);
  return messageBuffer.toString('utf8');
}

module.exports = {
  encryptMessage,
  decryptMessage
};

/*
$$C(t) = {\sum_{i=0}^n N_{i,p}(t) w_i P_i}{\sum_{i=0}^n N_{i,p}(t) w_i}$$
Где:

$C(t)$ — точка на кривой при параметре $t$ (обычно $t \in [0, 1]$).
$P_i$ — контрольные точки (вектор координат, например, $(x_i, y_i)$ для 2D).
$w_i$ — весовые коэффициенты для каждой контрольной точки (определяют, насколько сильно точка «тянет» кривую).
$N_{i,p}(t)$ — базисные функции B-сплайна степени $p$, которые зависят от узлового вектора.
$n$ — количество контрольных точек минус 1.
Узловой вектор — массив значений $t$, определяющий, где начинаются и заканчиваются сегменты сплайна.

Простое объяснение формулы:

Числитель ($\sum_{i=0}^n N_{i,p}(t) w_i P_i$) — это взвешенная сумма контрольных точек, где веса $w_i$ и базисные функции $N_{i,p}(t)$ определяют вклад каждой точки.
Знаменатель ($\sum_{i=0}^n N_{i,p}(t) w_i$) нормализует кривую, чтобы она была устойчивой и могла описывать сложные формы, такие как окружности.
Параметр $t$ «путешествует» по кривой, создавая плавную траекторию. */