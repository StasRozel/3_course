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
   

    STARTUPINFO si1;
    PROCESS_INFORMATION pi1;
    ZeroMemory(&si1, sizeof(si1));
    si1.cb = sizeof(si1);
    ZeroMemory(&pi1, sizeof(pi1));

    if (!CreateProcess(
        L"E:\\������\\3 ����\\��\\lab2\\x64\\Debug\\lab-02inf.exe",  // ��� ������������ �����
        NULL,                       // ��������� ������ (NULL, ���������� ������ ��������)
        NULL,                       // �������� ��������
        NULL,                       // �������� ������
        FALSE,                      // ������������ ������������
        0,                          // ����� �������� ��������
        NULL,                       // ���������
        NULL,                       // ������� ����������
        &si1,                       // ��������� �������
        &pi1                        // ���������� � ��������� ��������
    )) {
        printf("������ ��� �������� ������� ��������: %d\n", GetLastError());

    }
    else {
        printf("�������� ������� ������ � ID: %lu\n", pi1.dwProcessId);
    }
    system("pause");
    TerminateProcess(pi1.hProcess, 0);
    printf("ID2: %lu\n", GetProcessId(pi1.hProcess));
    system("pause");
    CloseHandle(pi1.hProcess);
   
    system("pause");
    printf("ID2: %lu\n", GetProcessId(pi1.hProcess));


    CloseHandle(pi1.hThread);
    printf("ID2: %lu\n", GetProcessId(pi1.hProcess));
    return 0;
}