#define _CRT_NON_CONFORMING_WCSTOK
#define _CRT_SECURE_NO_WARNINGS

#include <iostream>
#include <cstdlib>
#include "Windows.h"
#include <string>
#include <iomanip>
#include <memory>

using namespace std;

#define FILE_PATH L"E:\\Универ\\3 курс\\OC\\lab9\\OS09_01.txt"

void printFileInfo(LPWSTR FileName);
void printFileTxt(LPWSTR FileName);

int main()
{
    setlocale(LC_ALL, "rus");
    SetConsoleCP(1251);
    SetConsoleOutputCP(1251);

    LPWSTR fileName = (LPWSTR)FILE_PATH;

    printFileInfo(fileName);
    printFileTxt(fileName);

    return 0;
}

void printFileInfo(LPWSTR FileName)
{
    WIN32_FILE_ATTRIBUTE_DATA fileInfo;
    if (GetFileAttributesEx(FileName, GetFileExInfoStandard, &fileInfo)) {
        wcout << L"Имя файла: " << FileName << endl;

        DWORD fileAttributes = fileInfo.dwFileAttributes;
        wcout << L"Тип файла: ";
        wcout << ((fileAttributes & FILE_ATTRIBUTE_DIRECTORY) ? L"Каталог" : L"Файл") << endl;

        LARGE_INTEGER fileSize;
        fileSize.HighPart = fileInfo.nFileSizeHigh;
        fileSize.LowPart = fileInfo.nFileSizeLow;
        wcout << L"Размер файла: " << fileSize.QuadPart << L" байт" << endl;

        SYSTEMTIME stUTC, stLocal;
        FileTimeToSystemTime(&fileInfo.ftCreationTime, &stUTC);
        SystemTimeToTzSpecificLocalTime(NULL, &stUTC, &stLocal);
        wcout << L"Дата и время создания: " << stLocal.wDay << L"." << stLocal.wMonth << L"." << stLocal.wYear
            << L" " << setw(2) << setfill(L'0') << stLocal.wHour << L":" << setw(2) << stLocal.wMinute << endl;

        FileTimeToSystemTime(&fileInfo.ftLastWriteTime, &stUTC);
        SystemTimeToTzSpecificLocalTime(NULL, &stUTC, &stLocal);
        wcout << L"Дата и время последнего изменения: " << stLocal.wDay << L"." << stLocal.wMonth << L"." << stLocal.wYear
            << L" " << setw(2) << setfill(L'0') << stLocal.wHour << L":" << setw(2) << stLocal.wMinute << endl;
    }
    else {
        wcerr << L"Ошибка получения информации о файле." << endl;
    }
}

void printFileTxt(LPWSTR FileName)
{
    HANDLE file = CreateFile(
        FileName,
        GENERIC_READ,
        FILE_SHARE_READ,
        NULL,
        OPEN_EXISTING,
        FILE_ATTRIBUTE_NORMAL,
        NULL);

    if (file == INVALID_HANDLE_VALUE) {
        cerr << "Ошибка открытия файла." << endl;
        return;
    }

    LARGE_INTEGER fileSize;
    if (GetFileSizeEx(file, &fileSize)) {
        auto buffer = make_unique<char[]>(fileSize.QuadPart + 1);
        ZeroMemory(buffer.get(), fileSize.QuadPart + 1);

        DWORD bytesRead;
        if (ReadFile(file, buffer.get(), fileSize.QuadPart, &bytesRead, NULL)) {
            cout << "Содержимое файла:" << endl << buffer.get() << endl;
        }
        else {
            cerr << "Ошибка чтения файла." << endl;
        }
    }
    else {
        cerr << "Ошибка получения размера файла." << endl;
    }

    CloseHandle(file);
}
