#define _CRT_NON_CONFORMING_WCSTOK
#define _CRT_SECURE_NO_WARNINGS

#include <iostream>
#include <cstdlib>
#include <vector>
#include <algorithm>
#include "Windows.h"

#define FILE_PATH L"E:\\Универ\\3 курс\\OC\\lab9\\OS09_02.txt"

BOOL delRowFileTxt(LPWSTR FileName, DWORD row);
BOOL printFileTxt(LPWSTR FileName);

int main()
{
    setlocale(LC_ALL, "rus");

    LPWSTR fileName = (LPWSTR)FILE_PATH;

    std::wcout << L"До изменений:\n";
    if (!printFileTxt(fileName))
    {
        std::wcerr << L"Не удалось прочитать файл.\n";
        return 1;
    }

    std::vector<DWORD> rowsToDelete = { 1, 3, 8, 10 };

    std::sort(rowsToDelete.rbegin(), rowsToDelete.rend());

    for (DWORD row : rowsToDelete)
    {
        std::wcout << L"\nУдалена строка №" << row << L"...\n";
        if (!delRowFileTxt(fileName, row))
        {
            std::wcerr << L"Ошибка при удалении строки №" << row << L".\n";
        }
    }

    std::wcout << L"\nПосле изменений:\n";
    if (!printFileTxt(fileName))
    {
        std::wcerr << L"Не удалось прочитать файл.\n";
        return 1;
    }

    return 0;
}

BOOL delRowFileTxt(LPWSTR FileName, DWORD row)
{
    LARGE_INTEGER fileSize = {};
    bool rowFound = false;

    try
    {
        if (row <= 0)
        {
            throw "Номер строки должен быть положительным.";
        }

        HANDLE of = CreateFile(
            FileName,
            GENERIC_READ | GENERIC_WRITE,
            FILE_SHARE_READ,
            NULL,
            OPEN_EXISTING,
            FILE_ATTRIBUTE_NORMAL,
            NULL);

        if (of == INVALID_HANDLE_VALUE)
        {
            throw "Ошибка открытия файла.";
        }

        if (!GetFileSizeEx(of, &fileSize))
        {
            CloseHandle(of);
            throw "Ошибка получения размера файла.";
        }

        char* buf = new char[fileSize.QuadPart + 1];
        char* bufAfterDel = new char[fileSize.QuadPart + 1];
        ZeroMemory(buf, fileSize.QuadPart + 1);
        ZeroMemory(bufAfterDel, fileSize.QuadPart + 1);

        DWORD bytesRead = 0;
        if (!ReadFile(of, buf, fileSize.QuadPart, &bytesRead, NULL))
        {
            CloseHandle(of);
            delete[] buf;
            delete[] bufAfterDel;
            throw "Ошибка чтения файла.";
        }

        buf[fileSize.QuadPart] = '\0';

        int currentRow = 1, pos = 0, posAfter = 0;
        while (buf[pos] != '\0')
        {
            if (currentRow == row)
            {
                rowFound = true;
                while (buf[pos] != '\n' && buf[pos] != '\0')
                {
                    pos++;
                }
                if (buf[pos] == '\n')
                {
                    pos++;
                }
                currentRow++;
            }
            else
            {
                if (buf[pos] == '\n')
                {
                    currentRow++;
                }
                bufAfterDel[posAfter++] = buf[pos++];
            }
        }

        if (!rowFound)
        {
            CloseHandle(of);
            delete[] buf;
            delete[] bufAfterDel;
            throw "Указанная строка не найдена.";
        }

        bufAfterDel[posAfter] = '\0';

        SetFilePointer(of, 0, NULL, FILE_BEGIN);
        DWORD bytesWritten = 0;
        if (!WriteFile(of, bufAfterDel, strlen(bufAfterDel), &bytesWritten, NULL))
        {
            CloseHandle(of);
            delete[] buf;
            delete[] bufAfterDel;
            throw "Ошибка записи в файл.";
        }

        SetEndOfFile(of);

        std::cout << "Строка удалена успешно.\n";

        CloseHandle(of);
        delete[] buf;
        delete[] bufAfterDel;
    }
    catch (const char* err)
    {
        std::cout << "Ошибка:\n" << err << std::endl;
        return FALSE;
    }
    return TRUE;
}

BOOL printFileTxt(LPWSTR FileName)
{
    LARGE_INTEGER fileSize = {};

    try
    {
        HANDLE of = CreateFile(
            FileName,
            GENERIC_READ,
            FILE_SHARE_READ,
            NULL,
            OPEN_EXISTING,
            FILE_ATTRIBUTE_NORMAL,
            NULL);

        if (of == INVALID_HANDLE_VALUE)
        {
            throw "Ошибка открытия файла.";
        }

        if (!GetFileSizeEx(of, &fileSize))
        {
            CloseHandle(of);
            throw "Ошибка получения размера файла.";
        }

        char* buf = new char[fileSize.QuadPart + 1];
        ZeroMemory(buf, fileSize.QuadPart + 1);

        DWORD bytesRead = 0;
        if (!ReadFile(of, buf, fileSize.QuadPart, &bytesRead, NULL))
        {
            CloseHandle(of);
            delete[] buf;
            throw "Ошибка чтения файла.";
        }

        buf[fileSize.QuadPart] = '\0';

        std::cout << buf << std::endl;

        CloseHandle(of);
        delete[] buf;
    }
    catch (const char* err)
    {
        std::cout << "Ошибка:\n" << err << std::endl;
        return FALSE;
    }
    return TRUE;
}
