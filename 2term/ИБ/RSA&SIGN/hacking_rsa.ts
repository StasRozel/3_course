interface PrivateKeyResult {
    d?: bigint;
    n?: bigint;
    error?: string;
}

function isPrime(n: bigint): boolean {
    if (n < 2n) return false;
    const sqrtN = BigInt(Math.floor(Math.sqrt(Number(n))));
    for (let i = 2n; i <= sqrtN; i++) {
        if (n % i === 0n) return false;
    }
    return true;
}

function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} минут ${remainingSeconds} секунд`;
}

function factorize(n: bigint): [bigint | null, bigint | null] {
    const startTime = Date.now();
    const notificationInterval = 5 * 60 * 1000;
    let lastNotification = startTime;

    const sqrtN = BigInt(Math.floor(Math.sqrt(Number(n))));
    for (let i = 2n; i <= sqrtN; i++) {
        const currentTime = Date.now();
        if (currentTime - lastNotification >= notificationInterval) {
            const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
            console.log(`Факторизация продолжается, прошло: ${formatTime(elapsedSeconds)}`);
            lastNotification = currentTime;
        }

        if (n % i === 0n && isPrime(i) && isPrime(n / i)) {
            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            console.log(`Факторизация завершена за: ${formatTime(elapsedSeconds)}`);
            return [i, n / i];
        }
    }
    return [null, null];
}

function extendedGCD(a: bigint, b: bigint): [bigint, bigint, bigint] {
    if (a === 0n) {
        return [b, 0n, 1n];
    }
    const [gcd, x1, y1] = extendedGCD(b % a, a);
    const x = y1 - (b / a) * x1;
    const y = x1;
    return [gcd, x, y];
}

function findPrivateKey(e: bigint, n: bigint): PrivateKeyResult {
    const [p, q] = factorize(n);
    if (!p || !q) {
        return { error: "Не удалось факторизовать N на два простых числа" };
    }

    const phi: bigint = (p - 1n) * (q - 1n);

    const [gcd, d, _] = extendedGCD(e, phi);
    if (gcd !== 1n) {
        return { error: "e и phi(N) не взаимно простые, некорректный ключ" };
    }

    const dPositive: bigint = d < 0n ? d + phi : d;

    return { d: dPositive, n };
}

const args: string[] = process.argv.slice(2);

if (args.length !== 2) {
    console.log('Ошибка: необходимо указать два аргумента, например: node rsa_find_d.js 17 3233');
    process.exit(1);
}

let e: bigint, n: bigint;
try {
    e = BigInt(args[0]);
    n = BigInt(args[1]);
} catch {
    console.log('Ошибка: e и N должны быть целыми числами');
    process.exit(1);
}

if (e <= 0n) {
    console.log('Ошибка: e должно быть положительным числом');
    process.exit(1);
}

if (n <= 1n) {
    console.log('Ошибка: N должно быть числом больше 1');
    process.exit(1);
}

const result: PrivateKeyResult = findPrivateKey(e, n);
if (result.error) {
    console.log('Ошибка:', result.error);
} else {
    console.log(`Закрытый ключ: d = ${result.d}, N = ${result.n}`);
}