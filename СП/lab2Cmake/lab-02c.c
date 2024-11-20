#define _CRT_SECURE_NO_WARNINGS
#define WIN32_LEAN_AND_MEAN 
#include <Windows.h>
#include <processthreadsapi.h>
#include <stdio.h>
#include <stdlib.h>
#include <locale.h>

void CreateSomeProcess(const char* executablePath, const char* commandLine) {
    STARTUPINFO si1;
    PROCESS_INFORMATION pi1;
    ZeroMemory(&si1, sizeof(si1));
    si1.cb = sizeof(si1);
    ZeroMemory(&pi1, sizeof(pi1));

    if (!CreateProcessA(
        executablePath,  // Имя исполняемого файла
        commandLine,                       // Командная строка (NULL, используем первый параметр)
        NULL,                       // Атрибуты процесса
        NULL,                       // Атрибуты потока
        FALSE,                      // Наследование дескрипторов
        0,                          // Флаги создания процесса
        NULL,                       // Окружение
        NULL,                       // Текущая директория
        &si1,                       // Параметры запуска
        &pi1                        // Информация о созданном процессе
    ) ) {
        printf("Error during create process with commandline(%d): %s\n", GetLastError(), commandLine);
    }

    CloseHandle(pi1.hProcess);
    CloseHandle(pi1.hThread);
}
int main(int argc, char* argv[])
{
    setlocale(LC_ALL, "");
    const char* currentDir = L"E:\\Универ\\3 курс\\СП\\lab2";

    if (SetCurrentDirectory(currentDir) == NULL) {
        printf("Error during set current dir");
        ExitProcess(EXIT_FAILURE);
    }

    const char* commands[] = {
        "lab-02hw-1.exe",
        "lab-02hw-2.exe",
        "lab-02hw-3.exe",
        "lab-02hw-4.exe",
        "lab-02hw-5.exe",
    };

    CreateSomeProcess(NULL, commands[0]);
    CreateSomeProcess(NULL, commands[1]);
    CreateSomeProcess(NULL, commands[2]);
    CreateSomeProcess(NULL, commands[3]);
    CreateSomeProcess(NULL, commands[4]);

    ExitProcess(EXIT_SUCCESS);
}