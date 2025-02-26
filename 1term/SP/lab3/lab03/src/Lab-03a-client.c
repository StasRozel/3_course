#include <stdio.h>
#include <stdlib.h>
#include <windows.h>
#include <stdbool.h>

#define MAX_PRIMES 1024

bool is_prime(int num) {
    if (num < 2) return false;
    for (int i = 2; i * i <= num; i++) {
        if (num % i == 0) return false;
    }
    return true;
}

int main(int argc, char* argv[])
{
    if (argc < 3) {
        fprintf(stderr, "Usage: %s <lower> <upper> [mutex_name]\n", argv[0]);
        return EXIT_FAILURE;
    }

    int lower = atoi(argv[1]);
    int upper = atoi(argv[2]);

    if (lower < 0 || upper < 0) {
        fprintf(stderr, "Error: Both bounds must be non-negative integers.\n");
        return EXIT_FAILURE;
    }

    if (lower > upper) {
        fprintf(stderr, "Error: Lower bound must be less than or equal to upper bound.\n");
        return EXIT_FAILURE;
    }

    const char* default_mutex_name = "DefaultMutex";
    char env_mutex_name[10];
    GetEnvironmentVariable("LAB03A_MUTEX_NAME", env_mutex_name, 10);
    const char* mutex_name = (argc >= 4) ? argv[3] : (*env_mutex_name ? env_mutex_name : default_mutex_name);

    HANDLE hWrite = GetStdHandle(STD_OUTPUT_HANDLE);//Создание дескриптора вывода
    if (hWrite == INVALID_HANDLE_VALUE) {
        fprintf(stderr, "Error getting standard output handle: %lu\n", GetLastError());
        return EXIT_FAILURE;
    }

    HANDLE hMutex = OpenMutex(MUTEX_ALL_ACCESS/*доступ для всех*/, FALSE, mutex_name);
    if (hMutex == NULL) {
        fprintf(stderr, "Error opening mutex '%s': %lu\n", mutex_name, GetLastError());
        return EXIT_FAILURE;
    }

    int primes[MAX_PRIMES];
    int count = 0;

    for (int i = lower; i <= upper; i++) {
        if (is_prime(i) && count < MAX_PRIMES) {//Подсчет кол-во простых чисел
            primes[count++] = i;
        }
    }

    WaitForSingleObject(hMutex, INFINITE);

    DWORD written;
    if (WriteFile(hWrite, &count, sizeof(count), &written, NULL) && written == sizeof(count)) {//проверка доступности памяти для pipe
        ReleaseMutex(hMutex);
        Sleep(1000);
        WaitForSingleObject(hMutex, INFINITE);
        WriteFile(hWrite, primes, sizeof(int) * count, &written, NULL);
    }
    else {
        fprintf(stderr, "Error writing primes to pipe\n");
    }

    ReleaseMutex(hMutex);
    if (hMutex) CloseHandle(hMutex);
    if (hWrite) CloseHandle(hWrite);


    Sleep(40000);
    return EXIT_SUCCESS;
}
