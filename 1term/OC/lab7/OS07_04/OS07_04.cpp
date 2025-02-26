#include <iostream>
#include "string"
#include <Windows.h>

using namespace std;

STARTUPINFO si1, si2;
PROCESS_INFORMATION pi1, pi2;

BOOL createProc(const wchar_t* path, STARTUPINFO &si, PROCESS_INFORMATION &pi) {
    BOOL bRes = CreateProcessW(path,
        NULL, NULL, NULL, FALSE, CREATE_NEW_CONSOLE, NULL, NULL, &si, &pi);

    if (!bRes) {
        printf("error %d\n", GetLastError());
    }

    return bRes;
}

int main() {
    
    setlocale(LC_ALL, "rus");

    const wchar_t* pathProc1 = L"E:\\Универ\\3 курс\\OC\\lab7\\x64\\Debug\\OS07_04_1.exe";
    const wchar_t* pathProc2 = L"E:\\Универ\\3 курс\\OC\\lab7\\x64\\Debug\\OS07_04_2.exe";

    createProc(pathProc1, si1, pi1);

    ZeroMemory(&si1, sizeof(si1));
    si1.cb = sizeof(si1);
    ZeroMemory(&pi1, sizeof(pi1));

    createProc(pathProc2, si2, pi2);

    ZeroMemory(&si2, sizeof(si2));
    si2.cb = sizeof(si2);
    ZeroMemory(&pi2, sizeof(pi2));

    Sleep(120000);

    WaitForSingleObject(pi2.hProcess, INFINITE);
    WaitForSingleObject(pi1.hProcess, INFINITE);
    CloseHandle(pi1.hProcess);
    CloseHandle(pi2.hProcess);

    

}