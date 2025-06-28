const crypto = require('crypto');
const BigInt = require('big-integer');

class MerkleHellman {
  constructor(bitsCount = 100, S = 8) {
    this.bitsCount = bitsCount;
    this.S = S;
    this.privateKey = null;
    this.publicKey = null;
    this.n = null;
    this.a = null;
  }

  getRandomBigInt(min, max) {
    const range = max.subtract(min);
    const bits = range.bitLength().toJSNumber();
    let result;
    
    do {
      const bytes = crypto.randomBytes(Math.ceil(bits / 8));
      result = BigInt.fromArray([...bytes], 256);
      result = result.mod(range).add(min);
    } while (result.compare(max) >= 0);
    
    return result;
  }

  generatePrivateKey() {
    const sequence = [];
    let sum = BigInt(1);

    for (let i = 0; i < this.S; i++) {
      if (i === 0) {
        sequence.push(this.getRandomBigInt(BigInt(2), BigInt(10)));
      } else {
        const nextValue = this.getRandomBigInt(sum.add(BigInt(1)), sum.multiply(BigInt(2)));
        sequence.push(nextValue);
      }
      sum = sum.add(sequence[i]);
    }

    const lastElement = sequence[sequence.length - 1];
    const bitsInLast = lastElement.bitLength().toJSNumber();
    
    if (bitsInLast < this.bitsCount) {
      const difference = this.bitsCount - bitsInLast;
      const multiplier = BigInt(2).pow(difference);
      
      for (let i = 0; i < sequence.length; i++) {
        sequence[i] = sequence[i].multiply(multiplier);
      }
    }

    this.privateKey = sequence;
    return sequence;
  }

  generateModulusAndMultiplier() {
    if (!this.privateKey) {
      throw new Error("Сначала необходимо сгенерировать приватный ключ");
    }
    
    const sum = this.privateKey.reduce((acc, val) => acc.add(val), BigInt(0));
    
    this.n = this.getRandomBigInt(sum.add(BigInt(1)), sum.multiply(BigInt(2)));
    
    let attempts = 0;
    do {
      this.a = this.getRandomBigInt(BigInt(2), this.n.subtract(BigInt(1)));
      attempts++;
      if (attempts > 100) {
        this.n = this.getRandomBigInt(sum.add(BigInt(1)), sum.multiply(BigInt(2)));
        attempts = 0;
      }
    } while (this.gcd(this.a, this.n).notEquals(BigInt(1)));

    return { n: this.n, a: this.a };
  }

  gcd(a, b) {
    a = BigInt(a);
    b = BigInt(b);
    while (!b.isZero()) {
      const temp = b;
      b = a.mod(b);
      a = temp;
    }
    return a;
  }

  modInverse(a, n) {
    a = BigInt(a);
    n = BigInt(n);
    let [g, x, y] = this.extendedGcd(a, n);
    
    if (!g.equals(BigInt(1))) {
      throw new Error("Обратный элемент не существует");
    }
    
    return x.mod(n).add(n).mod(n);
  }

  extendedGcd(a, b) {
    a = BigInt(a);
    b = BigInt(b);
    if (b.isZero()) {
      return [a, BigInt(1), BigInt(0)];
    }
    
    const [gcd, x1, y1] = this.extendedGcd(b, a.mod(b));
    const x = y1;
    const y = x1.subtract(a.divide(b).multiply(y1));
    
    return [gcd, x, y];
  }

  generatePublicKey() {
    if (!this.privateKey) {
      this.generatePrivateKey();
    }
    
    if (!this.n || !this.a) {
      this.generateModulusAndMultiplier();
    }
    
    this.publicKey = this.privateKey.map(bi => this.a.multiply(bi).mod(this.n));
    return this.publicKey;
  }

  charToBinaryArray(char, bits = this.S) {
    const code = char.charCodeAt(0);
    const binaryStr = code.toString(2).padStart(bits, '0');
    return [...binaryStr].map(bit => parseInt(bit, 10));
  }

  textToBinaryArray(text) {
    let result = [];
    for (let i = 0; i < text.length; i++) {
      result = [...result, ...this.charToBinaryArray(text[i])];
    }
    return result;
  }

  encrypt(message) {
    if (!this.publicKey) {
      this.generatePublicKey();
    }
    
    // Убеждаемся, что publicKey состоит из BigInt
    if (this.publicKey.length > 0 && typeof this.publicKey[0] !== 'object') {
      this.publicKey = this.publicKey.map(x => BigInt(x));
    }
    
    const binaryArray = this.textToBinaryArray(message);
    const encryptedChunks = [];
    
    for (let i = 0; i < binaryArray.length; i += this.S) {
      const chunk = binaryArray.slice(i, i + this.S);
      
      // Дополняем чанк нулями до размера S
      while (chunk.length < this.S) {
        chunk.push(0);
      }
      
      let sum = BigInt(0);
      for (let j = 0; j < chunk.length; j++) {
        if (chunk[j] === 1) {
          sum = sum.add(this.publicKey[j]);
        }
      }
      
      encryptedChunks.push(sum);
    }
    
    return encryptedChunks;
  }

  decrypt(encryptedMessage) {
    if (!this.privateKey || !this.n || !this.a) {
      throw new Error("Необходимо сначала сгенерировать закрытый ключ");
    }
    
    // Убеждаемся, что все ключи и параметры - BigInt
    if (this.privateKey.length > 0 && typeof this.privateKey[0] !== 'object') {
      this.privateKey = this.privateKey.map(x => BigInt(x));
    }
    if (typeof this.n !== 'object') {
      this.n = BigInt(this.n);
    }
    if (typeof this.a !== 'object') {
      this.a = BigInt(this.a);
    }
    
    const aInverse = this.modInverse(this.a, this.n);
    const decryptedBinary = [];
    
    // Преобразуем зашифрованное сообщение в BigInt если нужно
    const encryptedBigInt = encryptedMessage.map(x => 
      typeof x === 'object' ? x : BigInt(x)
    );
    
    for (const encryptedChunk of encryptedBigInt) {
      const transformedSum = encryptedChunk.multiply(aInverse).mod(this.n);
      const bits = new Array(this.S).fill(0);
      let remaining = transformedSum;
      
      // Жадный алгоритм для декодирования супервозрастающей последовательности
      for (let i = this.privateKey.length - 1; i >= 0; i--) {
        if (remaining.compare(this.privateKey[i]) >= 0) {
          bits[i] = 1;
          remaining = remaining.subtract(this.privateKey[i]);
        }
      }
      
      decryptedBinary.push(...bits);
    }
    
    // Преобразуем двоичные данные обратно в текст
    let decryptedText = '';
    for (let i = 0; i < decryptedBinary.length; i += this.S) {
      if (i + this.S <= decryptedBinary.length) {
        const charBits = decryptedBinary.slice(i, i + this.S);
        const charCode = parseInt(charBits.join(''), 2);
        
        // Проверяем, что код символа валидный (не равен 0 и не превышает разумные пределы)
        if (charCode > 0 && charCode <= 1114111) {
          decryptedText += String.fromCharCode(charCode);
        }
      }
    }
    
    // Удаляем лишние нулевые символы в конце
    return decryptedText.replace(/\0+$/, '');
  }

  getKeyInfo() {
    return {
      privateKey: this.privateKey ? this.privateKey.map(x => 
        typeof x === 'object' ? x.toString() : x.toString()) : null,
      publicKey: this.publicKey ? this.publicKey.map(x => 
        typeof x === 'object' ? x.toString() : x.toString()) : null,
      modulus: this.n ? (typeof this.n === 'object' ? this.n.toString() : this.n.toString()) : null,
      multiplier: this.a ? (typeof this.a === 'object' ? this.a.toString() : this.a.toString()) : null
    };
  }

}

module.exports = { MerkleHellman };