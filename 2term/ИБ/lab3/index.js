const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function findPrimesInRange(start, end) {
  const primes = [];
  for (let i = start; i <= end; i++) {
    if (isPrime(i)) primes.push(i);
  }
  return primes;
}

function gcdTwoNumbers(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function gcdMultipleNumbers(numbers) {
  return numbers.reduce((acc, num) => gcdTwoNumbers(acc, num));
}

function showMenu() {
  console.log("\nВыберите действие:");
  console.log("1. Найти простые числа в диапазоне");
  console.log("2. Найти НОД для нескольких чисел");
  console.log("3. Выйти");
  rl.question("Ваш выбор: ", handleMenu);
}

function handleMenu(choice) {
  switch (choice.trim()) {
    case "1":
      askForRange();
      break;

    case "2":
      askForNumbers();
      break;

    case "3":
      console.log("Выход из программы. До свидания!");
      rl.close();
      break;

    default:
      console.log("Некорректный выбор. Попробуйте снова.");
      showMenu();
      break;
  }
}

function askForRange() {
  rl.question("Введите начало диапазона: ", (startInput) => {
    rl.question("Введите конец диапазона: ", (endInput) => {
      const start = parseInt(startInput);
      const end = parseInt(endInput);

      if (isNaN(start) || isNaN(end)) {
        console.log("Оба значения должны быть числами. Попробуйте снова.");
        askForRange();
      } else if (start > end) {
        console.log("Начало диапазона не может быть больше конца. Попробуйте снова.");
        askForRange();
      } else {
        const primes = findPrimesInRange(start, end);
        console.log(`Простые числа в диапазоне от ${start} до ${end}: ${primes.join(", ")}`);
        showMenu();
      }
    });
  });
}

function askForNumbers() {
  rl.question("Введите числа через пробел (не более 3 чисел): ", (input) => {
    const numbers = input
      .split(" ")
      .map(Number)
      .filter((num) => !isNaN(num));

      switch (numbers.length) {
        case 0:
          console.log("Вы не ввели ни одного числа. Попробуйте снова.");
          askForNumbers();
          break;
  
        case 1:
          console.log(
            `Вы ввели одно число: ${numbers[0]}. НОД для одного числа — это само число. Попробуйте снова.`
          );
          askForNumbers();
          break;
  
        case 2:
        case 3:
          const gcd = gcdMultipleNumbers(numbers);
          console.log(`НОД для чисел ${numbers.join(", ")}: ${gcd}`);
          showMenu();
          break;
  
        default:
          console.log("Вы ввели больше трёх чисел. Попробуйте снова.");
          askForNumbers();
          break;
      }
  });
}

console.log("Добро пожаловать в программу!");
showMenu();