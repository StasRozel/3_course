#include <windows.h>
#include <stdio.h>
#include <wchar.h>
#include <locale.h>

#define DEFAULT_PIPE_NAME L"\\\\.\\pipe\\lab3"
#define DEFAULT_SEMAPHORE_NAME L"lab3_semaphore"

void cleanRes(HANDLE hPipe, HANDLE hSemaphore)
{
    ReleaseSemaphore(hSemaphore, 1, NULL);
    CloseHandle(hSemaphore);
    CloseHandle(hPipe);
}

int wmain(int argc, wchar_t* argv[])
{
    setlocale(LC_ALL, "ru");

    if (argc < 2)
    {
        wprintf(L"Usage: cl03b <string> [pipe_name] [semaphore_name]\n");
        return 1;
    }

    wchar_t* inputStr = argv[1];
    wchar_t* lpszPipeName = (argc >= 3) ? argv[2] : DEFAULT_PIPE_NAME;
    wchar_t* lpszSemaphoreName;
    if (argc <= 3)
    {
        wchar_t buffer[255] = L"";
        int len = GetEnvironmentVariable("DEFAULT_SEMAPHORE", buffer, sizeof(buffer));

        if (len > 0 && len < sizeof(buffer) * sizeof(wchar_t))
        {
            printf("Get sem from env.\n");
            lpszSemaphoreName = buffer;
        }
        else
        {
            lpszSemaphoreName = DEFAULT_SEMAPHORE_NAME;
        }
    }
    else
    {
        lpszSemaphoreName = argv[3];
    }

    HANDLE hNamedPipe;
    HANDLE hSemaphore = OpenSemaphoreW(
        SYNCHRONIZE | SEMAPHORE_MODIFY_STATE,
        FALSE,
        lpszSemaphoreName);

    if (hSemaphore == NULL)
    {
        wprintf(L"Failed to open semaphore: %lu\n", GetLastError());
        return 1;
    }

    while (TRUE)
    {
        printf("\nWait semaphore ...\n");
        WaitForSingleObject(hSemaphore, INFINITE);

        hNamedPipe = CreateFileW(
            lpszPipeName,
            GENERIC_READ | GENERIC_WRITE,
            0,
            NULL,
            OPEN_EXISTING,
            0,
            NULL);

        if (hNamedPipe == INVALID_HANDLE_VALUE)
        {
            wprintf(L"Failed to connect to pipe: %lu\n", GetLastError());
            CloseHandle(hSemaphore);
            return 1;
        }

        DWORD bytesWritten;
        if (!WriteFile(hNamedPipe, inputStr, (wcslen(inputStr) + 1) * sizeof(wchar_t), &bytesWritten, NULL))
        {
            wprintf(L"Failed to write to pipe: %lu\n", GetLastError());
            cleanRes(hNamedPipe, hSemaphore);
            return 1;
        }

        wchar_t buffer[255];
        DWORD bytesRead;
        if (!ReadFile(hNamedPipe, buffer, sizeof(buffer), &bytesRead, NULL))
        {
            wprintf(L"Failed to read from pipe: %lu\n", GetLastError());
            cleanRes(hNamedPipe, hSemaphore);
            return 1;
        }
        else
        {
            buffer[bytesRead / sizeof(wchar_t)] = L'\0';
            wprintf(L"Received from server: %ls\n", buffer);
        }
        ReleaseSemaphore(hSemaphore, 1, NULL);
        Sleep(5000);
        printf("Done\n");
    }

    cleanRes(hNamedPipe, hSemaphore);

    return 0;
}
