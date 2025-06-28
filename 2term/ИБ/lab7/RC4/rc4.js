class RC4Generator {
    constructor(n = 8, key = [13, 19, 90, 92, 240]) {
      this.n = n;
      this.key = key;
      this.S = new Array(1 << n); // Размер S-блока: 2^n
      this.initialize();
    }
  
    // Инициализация S-блока и начальная перестановка
    initialize() {
      // Инициализация S-блока
      for (let i = 0; i < (1 << this.n); i++) {
        this.S[i] = i;
      }
  
      // Начальная перестановка
      let j = 0;
      for (let i = 0; i < (1 << this.n); i++) {
        j = (j + this.S[i] + this.key[i % this.key.length]) % (1 << this.n);
        // Обмен значениями S[i] и S[j]
        [this.S[i], this.S[j]] = [this.S[j], this.S[i]];
      }
  
      // Сбрасываем счетчики i и j для генерации
      this.i = 0;
      this.j = 0;
      
      // Сохраняем время начала для оценки производительности
      this.startTime = performance.now();
      this.bytesGenerated = 0;
      this.generationTimes = [];
    }
  
    // Генерировать один байт
    nextByte() {
      // Обновляем счетчики
      this.i = (this.i + 1) % (1 << this.n);
      this.j = (this.j + this.S[this.i]) % (1 << this.n);
      
      // Обмен значениями S[i] и S[j]
      [this.S[this.i], this.S[this.j]] = [this.S[this.j], this.S[this.i]];
      
      // Формируем индекс t и возвращаем соответствующий байт
      const t = (this.S[this.i] + this.S[this.j]) % (1 << this.n);
      
      this.bytesGenerated++;
      return this.S[t];
    }
  
    // Генерировать последовательность байтов заданной длины
    generateBytes(length) {
      const bytes = new Uint8Array(length);
      
      const startTime = performance.now();
      
      for (let i = 0; i < length; i++) {
        bytes[i] = this.nextByte();
      }
      
      const endTime = performance.now();
      this.generationTimes.push({
        count: length,
        time: endTime - startTime,
        bytesPerSecond: length / ((endTime - startTime) / 1000)
      });
      
      return bytes;
    }
  
    // Генерировать последовательность битов заданной длины
    generateBits(length) {
      // Определяем сколько байтов нам нужно
      const byteCount = Math.ceil(length / 8);
      const bytes = this.generateBytes(byteCount);
      
      // Преобразуем байты в биты
      const bits = [];
      for (let i = 0; i < length; i++) {
        const byteIndex = Math.floor(i / 8);
        const bitIndex = i % 8;
        bits.push((bytes[byteIndex] >> (7 - bitIndex)) & 1);
      }
      
      return bits;
    }
  
    // Получить статистику производительности
    getPerformanceStats() {
      const totalTime = performance.now() - this.startTime;
      const bytesPerSecond = this.bytesGenerated / (totalTime / 1000);
      
      return {
        totalBytes: this.bytesGenerated,
        totalTimeMs: totalTime,
        bytesPerSecond: bytesPerSecond,
        detailedStats: this.generationTimes
      };
    }
  
    // Сбросить статистику производительности
    resetPerformanceStats() {
      this.startTime = performance.now();
      this.bytesGenerated = 0;
      this.generationTimes = [];
    }
  
    // Метод для анализа сгенерированной последовательности
    analyzeSequence(bytes) {
      // Распределение байтов
      const distribution = new Array(256).fill(0);
      bytes.forEach(byte => distribution[byte]++);
      
      // Энтропия и другие метрики
      let entropy = 0;
      let nonZeroCount = 0;
      
      for (let i = 0; i < 256; i++) {
        if (distribution[i] > 0) {
          const probability = distribution[i] / bytes.length;
          entropy -= probability * Math.log2(probability);
          nonZeroCount++;
        }
      }
      
      return {
        entropy: entropy,
        uniqueBytes: nonZeroCount,
        distribution: distribution
      };
    }
  }
  
  module.exports = RC4Generator;