#define _CRT_NON_CONFORMING_WCSTOK
#define _CRT_SECURE_NO_WARNINGS

#include <iostream>
#include <cstdlib>
#include <windows.h>
#include <ctime>

using namespace std;

#define FILE_PATH L"E:\\Универ\\3 курс\\OC\\lab9\\OS09_03.txt"
#define FOLDER_PATH L"E:\\Универ\\3 курс\\OC\\lab9"

int rowC = 0;
HANDLE mutex;

BOOL printWatchRowFileTxt(LPWSTR FileName, DWORD mlsec, DWORD maxDuration);

int main()
{
    setlocale(LC_ALL, "ru");
    SetConsoleCP(1251);
    SetConsoleOutputCP(1251);

    mutex = CreateMutex(NULL, FALSE, L"FileAccessMutex");
    if (mutex == NULL) {
        cout << "Ошибка создания мьютекса." << endl;
        return 1;
    }

    LPWSTR fileName = (LPWSTR)FILE_PATH;
    DWORD waitTime = 1000;
    DWORD maxDuration = 10000;

    if (!printWatchRowFileTxt(fileName, waitTime, maxDuration)) {
        cout << "Ошибка при отслеживании изменений в файле." << endl;
    }

    CloseHandle(mutex);
    return 0;
}

BOOL printWatchRowFileTxt(LPWSTR FileName, DWORD mlsec, DWORD maxDuration)
{
    LARGE_INTEGER fileSize = { 0 };
    int rowCount = 0;

    try {
        HANDLE notif = FindFirstChangeNotification(FOLDER_PATH, FALSE, FILE_NOTIFY_CHANGE_LAST_WRITE);
        if (notif == INVALID_HANDLE_VALUE) {
            cout << "Ошибка при инициализации уведомления о изменениях." << endl;
            return FALSE;
        }

        DWORD dwWaitStatus;
        DWORD startTime = GetTickCount();

        while (true) {
            if ((GetTickCount() - startTime) >= maxDuration) {
                cout << "\nВремя слежения истекло." << endl;
                break;
            }

            dwWaitStatus = WaitForSingleObject(notif, mlsec);

            switch (dwWaitStatus) {
            case WAIT_OBJECT_0: {
                if (FindNextChangeNotification(notif) == FALSE) {
                    break;
                }

                WaitForSingleObject(mutex, INFINITE);

                HANDLE of = CreateFile(
                    FileName,
                    GENERIC_READ,
                    FILE_SHARE_READ,
                    NULL,
                    OPEN_EXISTING,
                    FILE_ATTRIBUTE_NORMAL,
                    NULL
                );

                if (of == INVALID_HANDLE_VALUE) {
                    DWORD dwError = GetLastError();
                    cout << "Ошибка: не удалось открыть файл. Код ошибки: " << dwError << endl;
                }
                else if (GetFileSizeEx(of, &fileSize)) {
                    char* buf = new char[(fileSize.QuadPart + 1) * sizeof(char)];
                    ZeroMemory(buf, (fileSize.QuadPart + 1) * sizeof(char));
                    DWORD n = 0;
                    if (ReadFile(of, buf, fileSize.QuadPart, &n, NULL)) {
                        int position = 0;
                        rowCount = 0;
                        bool lastLineIsEmpty = false;
                        while (buf[position] != '\0') {
                            if (buf[position] == '\n') {
                                rowCount++;
                                lastLineIsEmpty = false;
                            }
                            else {
                                lastLineIsEmpty = true;
                            }
                            position++;
                        }
                        if (lastLineIsEmpty && position > 0 && buf[position - 1] != '\n') {
                            rowCount++;
                        }
                    }
                    delete[] buf;
                    CloseHandle(of);
                }
                else {
                    cout << "Ошибка при чтении файла." << endl;
                }

                ReleaseMutex(mutex);

                if (rowC != rowCount) {
                    cout << "\nКоличество строк: " << rowCount;
                    if (rowCount > rowC) {
                        cout << " (Строки добавлены)" << endl;
                    }
                    else if (rowCount < rowC) {
                        cout << " (Строки удалены)" << endl;
                    }
                    rowC = rowCount;
                }
                break;
            }
            default:
                break;
            }
        }
        CloseHandle(notif);
    }
    catch (const char* err) {
        cout << "Ошибка: " << err << "\n";
        return false;
    }
    return true;
}
