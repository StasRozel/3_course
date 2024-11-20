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
        L"E:\\������\\3 ����\\��\\lab2\\x64\\Debug\\lab-02x.exe",  // ��� ������������ �����
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
        printf("������ �������� ������� ������ � ID: %lu\n", pi1.dwProcessId);
    }



    STARTUPINFO si2;
    PROCESS_INFORMATION pi2;
    ZeroMemory(&si2, sizeof(si2));
    si2.cb = sizeof(si2);
    ZeroMemory(&pi2, sizeof(pi2));
    wchar_t commandLine2[MAX_PATH];
    swprintf(commandLine2, MAX_PATH, L"lab-02x.exe %d", numIterations);


    if (!CreateProcess(
        NULL,                       // ��� ������������ ����� (NULL, ���������� ��������� ������)
        commandLine2,               // ��������� ������
        NULL,                       // �������� ��������
        NULL,                       // �������� ������
        FALSE,                      // ������������ ������������
        0,                          // ����� �������� ��������
        NULL,                       // ���������
        NULL,                       // ������� ����������
        &si2,                       // ��������� �������
        &pi2                        // ���������� � ��������� ��������
    )) {
        printf("������ ��� �������� ������� ��������: %d\n", GetLastError());
        return 1;
    }

    printf("������ �������� ������� ������ � ID: %lu\n", pi2.dwProcessId);


    STARTUPINFO si3;
    PROCESS_INFORMATION pi3;
    ZeroMemory(&si3, sizeof(si3));
    si3.cb = sizeof(si3);
    ZeroMemory(&pi3, sizeof(pi3));

    /*wchar_t commandLine3[MAX_PATH];
    swprintf(commandLine3, MAX_PATH, L" %d", numIterations);*/

    SetEnvironmentVariable(L"ITER_NUM", L"15");
    if (!CreateProcess(
        L"E:\\������\\3 ����\\��\\lab2\\x64\\Debug\\lab-02x.exe",  // ��� ������������ �����
        NULL,               // ��������� ������
        NULL,                       // �������� ��������
        NULL,                       // �������� ������
        FALSE,                      // ������������ ������������
        0,                          // ����� �������� ��������
        NULL,                       // ���������
        NULL,                       // ������� ����������
        &si3,                       // ��������� �������
        &pi3                        // ���������� � ��������� ��������
    )) {
        printf("������ ��� �������� �������� ��������: %d\n", GetLastError());
        return 1;
    }

    printf("������ �������� ������� ������ � ID: %lu\n", pi3.dwProcessId);


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