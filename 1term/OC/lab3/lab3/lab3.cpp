#include <iostream>
#include <windows.h>
#include <process.h>

int main()
{
    setlocale(LC_ALL, "Russian");

    DWORD pid = GetCurrentProcessId();

    std::cout << "Process ID: " << pid << std::endl;
    std::cout << "Начало цикла..." << std::endl;

    for (int i = 0; i < 100; i++)
    {
        Sleep(100);

        std::cout << "Итерация " << i + 1 << ", Process ID: " << pid << std::endl;
    }

    std::cout << "Цикл завершен" << std::endl;
    system("pause");
    return 0;
}