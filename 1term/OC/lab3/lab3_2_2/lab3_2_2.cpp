#include <windows.h>
#include <iostream>

int main()
{
    setlocale(LC_ALL, "Russian");

    DWORD pid = GetCurrentProcessId();

    for (int i = 0; i < 125; i++)
    {
        Sleep(1000);
        std::cout << "OS03_02_2 PID: " << pid << ", Итерация: " << i + 1 << "\n";
    }

    return 0;
}
