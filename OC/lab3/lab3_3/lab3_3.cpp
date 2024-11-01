#include <windows.h>
#include <tlhelp32.h>
#include <iostream>
#include <iomanip>

int main()
{
    setlocale(LC_ALL, "Russian");

    HANDLE hProcessSnap = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);

    if (hProcessSnap == INVALID_HANDLE_VALUE)
    {
        std::cout << "CreateToolhelp32Snapshot failed. Error: " << GetLastError() << std::endl;
        return 1;
    }

    PROCESSENTRY32W pe32;
    pe32.dwSize = sizeof(pe32);

    if (!Process32FirstW(hProcessSnap, &pe32))
    {
        std::cout << "Process32First failed. Error: " << GetLastError() << std::endl;
        CloseHandle(hProcessSnap);
        return 1;
    }

    std::cout << std::left << std::setw(8) << "PID"
        << std::setw(10) << "PPID"
        << std::setw(12) << "Threads"
        << std::setw(12) << "Priority"
        << "Process Name" << std::endl;
    std::cout << std::string(60, '-') << std::endl;

    do
    {
        std::wcout << std::left << std::setw(8) << pe32.th32ProcessID
            << std::setw(10) << pe32.th32ParentProcessID
            << std::setw(12) << pe32.cntThreads
            << std::setw(12) << pe32.pcPriClassBase
            << pe32.szExeFile << std::endl;

    } while (Process32NextW(hProcessSnap, &pe32));

    CloseHandle(hProcessSnap);

    std::cout << "\nНажмите любую клавишу для выхода...";
    std::cin.get();
    return 0;
}