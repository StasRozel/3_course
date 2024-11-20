#define _CRT_SECURE_NO_WARNINGS
#define WIN32_LEAN_AND_MEAN 
#include <Windows.h>
#include <processthreadsapi.h>
#include <stdio.h>
#include <stdlib.h>
#include <locale.h>
int main(int argc, char* argv[])
{
    setlocale(LC_ALL, "");
    if (argc != 2) {
        printf("�������������: %s <����������_��������>\n", argv[0]);
        return 1;
    }
    int numIterations = atoi(argv[1]);
    printf("num_iter %d\n", numIterations);

    STARTUPINFO si1;
    PROCESS_INFORMATION pi1;
    ZeroMemory(&si1, sizeof(si1));
    si1.cb = sizeof(si1);
    ZeroMemory(&pi1, sizeof(pi1));

    if (!CreateProcess(
        L"E:\\Универ\\3 курс\\СП\\lab2\\x64\\Debug\\lab-02x.exe",  // Имя исполняемого файла
        NULL,                       // Командная строка (NULL, используем первый параметр)
        NULL,                       // Атрибуты процесса
        NULL,                       // Атрибуты потока
        FALSE,                      // Наследование дескрипторов
        0,                          // Флаги создания процесса
        NULL,                       // Окружение
        NULL,                       // Текущая директория
        &si1,                       // Параметры запуска
        &pi1                        // Информация о созданном процессе
    )) {
        printf("Ошибка при создании первого процесса: %d\n", GetLastError());

    }
    else {
        printf("Первый дочерний процесс создан с ID: %lu\n", pi1.dwProcessId);
    }



    STARTUPINFO si2;
    PROCESS_INFORMATION pi2;
    ZeroMemory(&si2, sizeof(si2));
    si2.cb = sizeof(si2);
    ZeroMemory(&pi2, sizeof(pi2));
    wchar_t commandLine2[MAX_PATH];
    swprintf(commandLine2, MAX_PATH, L"lab-02x.exe %d", numIterations);


    if (!CreateProcess(
        NULL,                       // Имя исполняемого файла (NULL, используем командную строку)
        commandLine2,               // Командная строка
        NULL,                       // Атрибуты процесса
        NULL,                       // Атрибуты потока
        FALSE,                      // Наследование дескрипторов
        0,                          // Флаги создания процесса
        NULL,                       // Окружение
        NULL,                       // Текущая директория
        &si2,                       // Параметры запуска
        &pi2                        // Информация о созданном процессе
    )) {
        printf("Ошибка при создании второго процесса: %d\n", GetLastError());
        return 1;
    }

    printf("Второй дочерний процесс создан с ID: %lu\n", pi2.dwProcessId);


    STARTUPINFO si3;
    PROCESS_INFORMATION pi3;
    ZeroMemory(&si3, sizeof(si3));
    si3.cb = sizeof(si3);
    ZeroMemory(&pi3, sizeof(pi3));

    /*wchar_t commandLine3[MAX_PATH];
    swprintf(commandLine3, MAX_PATH, L" %d", numIterations);*/

    SetEnvironmentVariable(L"ITER_NUM", L"15");
     if (!CreateProcess(
        L"E:\\Универ\\3 курс\\СП\\lab2\\x64\\Debug\\lab-02x.exe",  // Имя исполняемого файла
        NULL,               // Командная строка
        NULL,                       // Атрибуты процесса
        NULL,                       // Атрибуты потока
        FALSE,                      // Наследование дескрипторов
        0,                          // Флаги создания процесса
        NULL,                       // Окружение
        NULL,                       // Текущая директория
        &si3,                       // Параметры запуска
        &pi3                        // Информация о созданном процессе
    )) {
        printf("Ошибка при создании третьего процесса: %d\n", GetLastError());
        return 1;
    }

    printf("Третий дочерний процесс создан с ID: %lu\n", pi3.dwProcessId);


    WaitForSingleObject(pi1.hProcess, INFINITE);
    WaitForSingleObject(pi2.hProcess, INFINITE);
    WaitForSingleObject(pi3.hProcess, INFINITE);

    CloseHandle(pi1.hProcess);
    CloseHandle(pi1.hThread);
    CloseHandle(pi2.hProcess);
    CloseHandle(pi2.hThread);
    CloseHandle(pi3.hProcess);
    CloseHandle(pi3.hThread);

    return 0;
}