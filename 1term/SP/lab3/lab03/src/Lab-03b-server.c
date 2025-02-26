#include <windows.h>
#include <stdio.h>
#include <wchar.h>
#include <ctype.h>
#include <locale.h>

#define DEFAULT_PIPE_NAME L"\\\\.\\pipe\\lab3"
#define DEFAULT_SEMAPHORE_NAME L"lab3_semaphore"

void to_upper(wchar_t* str)
{
    while (*str)
    {
        *str = towupper(*str);
        str++;
    }
}

int wmain(int argc, wchar_t* argv[])
{
    setlocale(LC_ALL, "ru");

    wchar_t* lpszPipeName = (argc >= 2) ? argv[1] : DEFAULT_PIPE_NAME;
    wchar_t* lpszSemaphoreName;
    if (argc < 3)
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
        lpszSemaphoreName = argv[2];
    }
    
    HANDLE hSemaphore = CreateSemaphoreW(NULL, 1, 1, lpszSemaphoreName);
    if (hSemaphore == NULL)
    {
        wprintf(L"Failed to create semaphore: %lu\n", GetLastError());
        return 1;
    }

    // Сервер будет ждать подключения клиента в отдельном цикле
    wprintf(L"Server waiting for clients...\n");

    while (TRUE)
    {
        HANDLE hNamedPipe = CreateNamedPipeW(
            lpszPipeName,
            PIPE_ACCESS_DUPLEX,
            PIPE_TYPE_MESSAGE | PIPE_READMODE_MESSAGE | PIPE_WAIT,
            PIPE_UNLIMITED_INSTANCES,
            256 * sizeof(wchar_t),
            256 * sizeof(wchar_t),
            0,
            NULL);

        if (hNamedPipe == INVALID_HANDLE_VALUE)
        {
            wprintf(L"Failed to create pipe: %lu\n", GetLastError());
            CloseHandle(hSemaphore);
            return 1;
        }

        if (!ConnectNamedPipe(hNamedPipe, NULL))
        {
            wprintf(L"Failed to connect pipe: %lu\n", GetLastError());
            CloseHandle(hNamedPipe);
            continue;
        }

        printf("\nClient connected.\n");

        // Теперь обрабатываем данные
        wchar_t buffer[255];
        DWORD bytesRead;
        if (!ReadFile(hNamedPipe, buffer, sizeof(buffer), &bytesRead, NULL))
        {
            wprintf(L"Failed to read from pipe: %lu\n", GetLastError());
            DisconnectNamedPipe(hNamedPipe);
            CloseHandle(hNamedPipe);
            continue;
        }

        buffer[bytesRead / sizeof(wchar_t)] = L'\0';

        wprintf(L"Input string: %ls\n", buffer);
        to_upper(buffer);
        wprintf(L"Output string: %ls\n", buffer);

        DWORD bytesWritten;
        if (!WriteFile(hNamedPipe, buffer, (wcslen(buffer) + 1) * sizeof(wchar_t), &bytesWritten, NULL))
        {
            wprintf(L"Failed to write to pipe: %lu\n", GetLastError());
        }

        // Отключаем клиентское соединение и ждем нового
        DisconnectNamedPipe(hNamedPipe);
        CloseHandle(hNamedPipe);
    }

    CloseHandle(hSemaphore);

    return 0;
}
