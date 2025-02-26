#include <windows.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

// Глобальные переменные
CRITICAL_SECTION criticalSection; // Критическая секция для синхронизации
int* globalArray = NULL;          // Глобальный массив простых чисел
int globalArraySize = 0;          // Размер глобального массива
int globalArrayCapacity = 0;      // Вместимость глобального массива

// Thread Local Storage (TLS) переменные
__declspec(thread) int* localBuffer = NULL; // Локальный буфер для хранения простых чисел
__declspec(thread) int localCount = 0;     // Количество найденных простых чисел в потоке

typedef struct {
    int start;
    int end;
} Range;

// Проверка числа на простоту
bool isPrime(int num) {
    if (num < 2) return false;
    for (int i = 2; i * i <= num; i++) {
        if (num % i == 0) return false;
    }
    return true;
}

// Добавление числа в глобальный массив
void addToGlobalArray(int prime) {
    EnterCriticalSection(&criticalSection);

    if (globalArraySize == globalArrayCapacity) {
        globalArrayCapacity = globalArrayCapacity == 0 ? 10 : globalArrayCapacity * 2;
        globalArray = realloc(globalArray, globalArrayCapacity * sizeof(int));
        if (!globalArray) {
            fprintf(stderr, "Ошибка выделения памяти для глобального массива.\n");
            LeaveCriticalSection(&criticalSection);
            exit(EXIT_FAILURE);
        }
    }

    globalArray[globalArraySize++] = prime;

    LeaveCriticalSection(&criticalSection);
}

// Функция потока
DWORD WINAPI L4Thread(LPVOID param) {
    Range* range = (Range*)param;

    // Инициализация локального буфера
    localBuffer = (int*)malloc((range->end - range->start + 1) * sizeof(int));
    if (!localBuffer) {
        fprintf(stderr, "Ошибка выделения памяти для локального буфера.\n");
        return 1;
    }
    localCount = 0;

    // Поиск простых чисел в заданном диапазоне
    for (int i = range->start; i <= range->end; i++) {
        if (isPrime(i)) {
            localBuffer[localCount++] = i;
        }
    }

    // Запись данных из локального буфера в глобальный массив
    for (int i = 0; i < localCount; i++) {
        addToGlobalArray(localBuffer[i]);
    }

    free(localBuffer); // Очистка локального буфера
    localBuffer = NULL;
    localCount = 0;
    return 0;
}

// Сортировка массива
int compare(const void* a, const void* b) {
    return (*(int*)a - *(int*)b);
}

int main(int argc, char* argv[]) {
    if (argc != 4) {
        fprintf(stderr, "Использование: %s <количество потоков> <нижний порог> <верхний порог>\n", argv[0]);
        return 1;
    }

    int threadCount = atoi(argv[1]);
    int rangeStart = atoi(argv[2]);
    int rangeEnd = atoi(argv[3]);

    if (threadCount <= 0 || rangeStart < 0 || rangeEnd < rangeStart) {
        fprintf(stderr, "Некорректные входные параметры.\n");
        return 1;
    }

    HANDLE* threads = (HANDLE*)malloc(threadCount * sizeof(HANDLE));
    Range* ranges = (Range*)malloc(threadCount * sizeof(Range));

    if (!threads || !ranges) {
        fprintf(stderr, "Ошибка выделения памяти.\n");
        return 1;
    }

    InitializeCriticalSection(&criticalSection);

    int rangeSize = (rangeEnd - rangeStart + 1) / threadCount;
    int remainder = (rangeEnd - rangeStart + 1) % threadCount;

    int currentStart = rangeStart;

    for (int i = 0; i < threadCount; i++) {
        ranges[i].start = currentStart;
        ranges[i].end = currentStart + rangeSize - 1 + (i < remainder ? 1 : 0);
        currentStart = ranges[i].end + 1;

        threads[i] = CreateThread(NULL, 0, L4Thread, &ranges[i], 0, NULL);
        if (!threads[i]) {
            fprintf(stderr, "Ошибка создания потока.\n");
            return 1;
        }
    }

    // Ожидание завершения всех потоков
    WaitForMultipleObjects(threadCount, threads, TRUE, INFINITE);

    // Очистка ресурсов потоков
    for (int i = 0; i < threadCount; i++) {
        CloseHandle(threads[i]);
    }

    // Сортировка глобального массива
    qsort(globalArray, globalArraySize, sizeof(int), compare);

    // Вывод результата
    printf("Найденные простые числа:\n");
    for (int i = 0; i < globalArraySize; i++) {
        printf("%d ", globalArray[i]);
    }
    printf("\n");

    // Очистка ресурсов
    free(globalArray);
    free(threads);
    free(ranges);
    DeleteCriticalSection(&criticalSection);

    return 0;
}
