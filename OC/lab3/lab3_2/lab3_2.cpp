#include <windows.h>
#include <iostream>
#include <string>

int main()
{
    setlocale(LC_ALL, "Russian");

    DWORD pid = GetCurrentProcessId();

    STARTUPINFO si1 = { sizeof(STARTUPINFO) };
    PROCESS_INFORMATION pi1;

    STARTUPINFO si2 = { sizeof(STARTUPINFO) };
    PROCESS_INFORMATION pi2;

    if (CreateProcess(L"lab3_2_1.exe",  NULL,NULL,NULL,FALSE,CREATE_NEW_CONSOLE,NULL,NULL,&si1,&pi1))                    
    {
        std::cout << "Процесс OS03_02_1 создан\n";
    }
    else
    {
        std::cout << "Ошибка при создании OS03_02_1\n";
    }

    if (CreateProcess(L"lab3_2_2.exe", NULL, NULL, NULL, FALSE, CREATE_NEW_CONSOLE, NULL, NULL, &si2, &pi2))
    {
        std::cout << "Процесс OS03_02_2 создан\n";
    }
    else
    {
        std::cout << "Ошибка при создании OS03_02_2\n";
    }

    for (int i = 0; i < 100; i++)
    {
        Sleep(1000);
        std::cout << "OS03_02 PID: " << pid << ", Итерация: " << i + 1 << "\n";
    }

    CloseHandle(pi1.hProcess);
    CloseHandle(pi1.hThread);
    CloseHandle(pi2.hProcess);
    CloseHandle(pi2.hThread);

    return 0;
}