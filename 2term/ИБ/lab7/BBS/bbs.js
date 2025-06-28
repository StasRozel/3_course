// Файл: bbs.js
const bigInt = require('big-integer');

class BBSGenerator {
  constructor() {
    // Выбираем простые числа p и q такие, что p ≡ q ≡ 3 (mod 4)
    this.p = bigInt('11');
    this.q = bigInt('19');
    
    // Вычисляем модуль n = p * q
    this.n = this.p.multiply(this.q);
    
    // Проверяем, что числа выбраны правильно
    if (!this.p.mod(4).equals(3) || !this.q.mod(4).equals(3)) {
      throw new Error('P и Q должны быть равны 3 по модулю 4');
    }
    this.startTime = performance.now();
    // Инициализируем generationTimes как пустой массив
    this.generationTimes = [];
    this.reset();
  }
  
  // Сбросить состояние генератора с новым начальным значением
  reset(seed = null) {
    // Если seed не предоставлен, генерируем случайное seed
    if (seed === null) {
      // Используем текущее время в качестве простого seed
      seed = Date.now().toString();
    }
    
    // Преобразуем seed в число
    const seedNum = bigInt(Buffer.from(seed.toString()).reduce((acc, val) => acc + val, 0));
    
    // Убедимся, что seed взаимно прост с n
    this.x = seedNum.mod(this.n);
    if (bigInt.gcd(this.x, this.n).notEquals(1)) {
      this.x = this.x.add(1);
    }
    
    this.sequence = [];
  }
  
  // Генерировать одно бит значение
  nextBit() {
    // x = x^2 mod n
    this.x = this.x.pow(2).mod(this.n);
    
    // Возвращаем младший бит x
    return this.x.isOdd() ? 1 : 0;
  }
  
  // Генерировать последовательность битов заданной длины
  generateBits(length) {
    const bits = [];
    const startTime = performance.now();
    for (let i = 0; i < length; i++) {
      bits.push(this.nextBit());
    }
    const endTime = performance.now();
    this.generationTimes.push({
      count: length,
      time: endTime - startTime,
      bytesPerSecond: length / ((endTime - startTime) / 1000)
    });
    return bits;
  }
  
  // Генерировать последовательность байтов заданной длины
  generateBytes(length) {
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      let byte = 0;
      for (let j = 0; j < 8; j++) {
        byte = (byte << 1) | this.nextBit();
      }
      bytes[i] = byte;
    }
    return bytes;
  }
  
  // Генерировать последовательность случайных чисел от 0 до max-1
  generateNumbers(count, max) {
    const numbers = [];
    for (let i = 0; i < count; i++) {
      // Определяем сколько битов нам нужно для представления max
      const bitsNeeded = Math.ceil(Math.log2(max));
      let num = 0;
      for (let j = 0; j < bitsNeeded; j++) {
        num = (num << 1) | this.nextBit();
      }
      numbers.push(num % max);
    }
    return numbers;
  }
  
  // Сгенерировать последовательность из n битов
  generateSequence(n) {
    this.sequence = this.generateBits(n);
    return this.sequence;
  }
  
  // Получить текущую последовательность
  getSequence() {
    return this.sequence;
  }
  
  // Анализ последовательности (для демонстрации)
  analyzeSequence() {
    if (this.sequence.length === 0) {
      return { zeros: 0, ones: 0, ratio: 0 };
    }
    
    const zeros = this.sequence.filter(bit => bit === 0).length;
    const ones = this.sequence.filter(bit => bit === 1).length;
    
    return {
      zeros,
      ones,
      ratio: ones / this.sequence.length
    };
  }
}

module.exports = BBSGenerator;