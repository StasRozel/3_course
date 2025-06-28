const { MD5Hasher } = require('./md5.js');
const md5Hasher = new MD5Hasher();

function hashMessage() {
    const message = document.getElementById('messageInput').value;

    if (!message.trim()) {
        alert('Пожалуйста, введите сообщение для хеширования');
        return;
    }

    const result = md5Hasher.hash(message);

    // Отображаем результаты
    document.getElementById('hashResult').textContent = result.hash;
    document.getElementById('execTime').textContent = result.executionTime.toFixed(3);
    document.getElementById('msgLength').textContent = result.messageLength;
    document.getElementById('bytesProcessed').textContent = result.bytesProcessed;

    // Вычисляем пропускную способность
    const throughput = (result.bytesProcessed / (1024 * 1024)) / (result.executionTime / 1000);
    document.getElementById('throughput').textContent = throughput.toFixed(2);

    document.getElementById('resultSection').classList.remove('hidden');
}

function clearAll() {
    document.getElementById('messageInput').value = '';
    document.getElementById('resultSection').classList.add('hidden');
    document.getElementById('benchmarkSection').classList.add('hidden');
}

async function runBenchmark() {
    const benchmarkSection = document.getElementById('benchmarkSection');
    const progressFill = document.getElementById('progressFill');
    const benchmarkResults = document.getElementById('benchmarkResults');

    benchmarkSection.classList.remove('hidden');
    benchmarkResults.innerHTML = '';

    const testSizes = [100, 1000, 10000, 100000, 1000000];
    const testNames = ['100 байт', '1 KB', '10 KB', '100 KB', '1 MB'];

    let results = '';

    for (let i = 0; i < testSizes.length; i++) {
        // Обновляем прогресс
        progressFill.style.width = ((i / testSizes.length) * 100) + '%';

        // Создаем тестовое сообщение
        const testMessage = 'A'.repeat(testSizes[i]);

        // Множественные тесты для точности
        const iterations = Math.max(1, Math.floor(10000 / testSizes[i]));
        let totalTime = 0;

        for (let j = 0; j < iterations; j++) {
            const result = md5Hasher.hash(testMessage);
            totalTime += result.executionTime;
        }

        const avgTime = totalTime / iterations;
        const throughput = (testSizes[i] / (1024 * 1024)) / (avgTime / 1000);

        results += `
            <div class="perf-item" style="margin-bottom: 10px;">
                <strong>${testNames[i]}</strong><br>
                Время: ${avgTime.toFixed(3)} мс<br>
                Пропускная способность: ${throughput.toFixed(2)} MB/s
            </div>
        `;

        // Небольшая задержка для отображения прогресса
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    progressFill.style.width = '100%';
    benchmarkResults.innerHTML = results;
}

// Обработка Enter в textarea
document.getElementById('messageInput').addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'Enter') {
        hashMessage();
    }
});