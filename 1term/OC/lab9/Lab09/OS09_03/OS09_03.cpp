#define _CRT_NON_CONFORMING_WCSTOK
#define _CRT_SECURE_NO_WARNINGS

#include <iostream>
#include <cstdlib>
#include "Windows.h"

using namespace std;

#define FILE_PATH L"E:\\Универ\\3 курс\\OC\\lab9\\OS09_03.txt"

BOOL insRowFileTxt(LPWSTR FileName, LPWSTR str, DWORD row);
BOOL printFileTxt(LPWSTR fileName);

HANDLE mutex;

int main() {
    setlocale(LC_ALL, "rus");

    mutex = CreateMutex(NULL, FALSE, L"FileAccessMutex");
    if (mutex == NULL) {
        cout << "Ошибка создания мьютекса." << endl;
        return 1;
    }

    LPWSTR fileName = (LPWSTR)FILE_PATH;

    cout << "Изначальное содержание файла:\n";
    printFileTxt(fileName);

    cout << "\nВставка строки в файл:\n";
    insRowFileTxt(fileName, (LPWSTR)L"0. aboba", 0);
    insRowFileTxt(fileName, (LPWSTR)L"-1. aboba", -1);
    insRowFileTxt(fileName, (LPWSTR)L"5. aboba", 5);
    insRowFileTxt(fileName, (LPWSTR)L"7. aboba", 7);

    cout << "\nОбновление файла:\n";
    printFileTxt(fileName);

    CloseHandle(mutex);
    return 0;
}

BOOL printFileTxt(LPWSTR fileName) {
    HANDLE file = CreateFile(
        fileName,
        GENERIC_READ,
        FILE_SHARE_READ,
        NULL,
        OPEN_EXISTING,
        FILE_ATTRIBUTE_NORMAL,
        NULL);

    if (file == INVALID_HANDLE_VALUE) {
        cout << "Ошибка: Не удалось открыть файл." << endl;
        return FALSE;
    }

    DWORD fileSize = GetFileSize(file, NULL);
    if (fileSize == INVALID_FILE_SIZE) {
        cout << "Ошибка: Не удалось получить размер файла." << endl;
        CloseHandle(file);
        return FALSE;
    }

    char* buffer = new char[fileSize + 1];
    ZeroMemory(buffer, fileSize + 1);
    DWORD bytesRead;

    if (ReadFile(file, buffer, fileSize, &bytesRead, NULL)) {
        cout << buffer << endl;
    }
    else {
        cout << "Ошибка: Не удалось прочитать файл." << endl;
    }

    delete[] buffer;
    CloseHandle(file);
    return TRUE;
}

BOOL insRowFileTxt(LPWSTR fileName, LPWSTR str, DWORD row) {
    WaitForSingleObject(mutex, INFINITE);

    HANDLE file = CreateFile(
        fileName,
        GENERIC_READ | GENERIC_WRITE,
        FILE_SHARE_READ,
        NULL,
        OPEN_ALWAYS,
        FILE_ATTRIBUTE_NORMAL,
        NULL);

    if (file == INVALID_HANDLE_VALUE) {
        cout << "Ошибка: Не удалось открыть файл." << endl;
        ReleaseMutex(mutex);
        return FALSE;
    }

    DWORD fileSize = GetFileSize(file, NULL);
    if (fileSize == INVALID_FILE_SIZE) {
        cout << "Ошибка: Не удалось получить размер файла." << endl;
        CloseHandle(file);
        ReleaseMutex(mutex);
        return FALSE;
    }

    char* buffer = new char[fileSize + 1];
    ZeroMemory(buffer, fileSize + 1);
    DWORD bytesRead;

    if (!ReadFile(file, buffer, fileSize, &bytesRead, NULL)) {
        cout << "Ошибка: Не удалось прочитать файл." << endl;
        delete[] buffer;
        CloseHandle(file);
        ReleaseMutex(mutex);
        return FALSE;
    }

    buffer[fileSize] = '\0';

    char* newRow = new char[wcslen(str) * 2 + 3];
    wcstombs(newRow, str, wcslen(str) * 2);
    strcat(newRow, "\r\n");

    string result;
    int currentRow = 0;
    bool inserted = false;
    char* line = strtok(buffer, "\n");

    while (line != NULL) {
        if (currentRow == row && !inserted) {
            result += newRow;
            inserted = true;
        }
        result += line;
        result += "\n";
        line = strtok(NULL, "\n");
        currentRow++;
    }

    if (row == -1 || row >= currentRow) {
        result += newRow;
    }

    SetFilePointer(file, 0, NULL, FILE_BEGIN);
    DWORD bytesWritten;
    if (!WriteFile(file, result.c_str(), result.size(), &bytesWritten, NULL)) {
        cout << "Ошибка: Не удалось записать в файл." << endl;
    }

    SetEndOfFile(file);

    cout << "\nВставлена строка: " << newRow;

    delete[] buffer;
    delete[] newRow;
    CloseHandle(file);
    ReleaseMutex(mutex);
    return TRUE;
}
