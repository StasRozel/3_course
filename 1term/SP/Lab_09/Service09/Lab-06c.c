#include <windows.h>
#include <tchar.h>
#include <stdio.h>
#include <time.h>

#define SERVICE_NAME  _T("DirectoryWatcherService")
SERVICE_STATUS g_ServiceStatus = { 0 };
SERVICE_STATUS_HANDLE g_StatusHandle = NULL;
HANDLE g_ServiceStopEvent = NULL;
HANDLE g_ServicePauseEvent = NULL;
FILE* logFile = NULL;
FILE* serviceLogFile = NULL;


void CreateLogFileNames(char* logFilePath, char* serviceLogFilePath, const char* logDirectory) {
    time_t t = time(NULL);
    struct tm tm;
    localtime_s(&tm, &t);
    snprintf(logFilePath, MAX_PATH, "%s\\%04d-%02d-%02d_%02d-%02d-%02d-dir.log", 
             logDirectory, tm.tm_year + 1900, tm.tm_mon + 1, tm.tm_mday, tm.tm_hour, tm.tm_min, tm.tm_sec);
    snprintf(serviceLogFilePath, MAX_PATH, "%s\\%04d-%02d-%02d_%02d-%02d-%02d-srv.log", 
             logDirectory, tm.tm_year + 1900, tm.tm_mon + 1, tm.tm_mday, tm.tm_hour, tm.tm_min, tm.tm_sec);
}

void GetCurrentTimeString(char* buffer, size_t bufferSize)
{
    time_t t = time(NULL);
    struct tm tm;
    localtime_s(&tm, &t);
    
    snprintf(buffer, bufferSize, "[%04d-%02d-%02d %02d:%02d:%02d]", tm.tm_year + 1900, tm.tm_mon + 1, tm.tm_mday, tm.tm_hour, tm.tm_min, tm.tm_sec);
}

void LogMessage(FILE* logFile, const char* messageFormat, ...)
{
    char timeString[32];
    GetCurrentTimeString(timeString, sizeof(timeString));
    va_list args;
    va_start(args, messageFormat);

    fprintf(logFile, "%s ", timeString);
    vfprintf(logFile, messageFormat, args);
    fprintf(logFile, "\n");

    fflush(logFile);

    va_end(args);
}

void PrintDirectoryContentsRecursive(const char* directoryPath) {
    WIN32_FIND_DATAA findData;
    char searchPath[MAX_PATH];
    snprintf(searchPath, MAX_PATH, "%s\\*", directoryPath);

    HANDLE hFind = FindFirstFileA(searchPath, &findData);

    if (hFind == INVALID_HANDLE_VALUE) {
        LogMessage(logFile, "Error: Unable to open directory %s\n", directoryPath);
        return;
    }

    do {
        if (strcmp(findData.cFileName, ".") != 0 && strcmp(findData.cFileName, "..") != 0) {
            char fullPath[MAX_PATH];
            snprintf(fullPath, MAX_PATH, "%s\\%s", directoryPath, findData.cFileName);

            if (findData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) {
                LogMessage(logFile, "Directory: %s\n", fullPath);
                PrintDirectoryContentsRecursive(fullPath);
            } else {
                LogMessage(logFile, "File: %s\n", fullPath);
            }
        }
    } while (FindNextFileA(hFind, &findData) != 0);

    FindClose(hFind);
}

void WatchDirectory(const char* directoryPath)
{
    HANDLE hDir = CreateFileA(
        directoryPath,
        FILE_LIST_DIRECTORY,
        FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE,
        NULL,
        OPEN_EXISTING,
        FILE_FLAG_BACKUP_SEMANTICS,
        NULL
    );

    if (hDir == INVALID_HANDLE_VALUE) {
        LogMessage(logFile, "Error: Unable to open directory %s. Error code: %lu\n", directoryPath, GetLastError());
        return;
    }

    char buffer[1024];
    DWORD bytesReturned;

    while (1) {
        if (WaitForSingleObject(g_ServiceStopEvent, 0) == WAIT_OBJECT_0) {
            break;
        }

        if (WaitForSingleObject(g_ServicePauseEvent, 0) == WAIT_OBJECT_0) {
            WaitForSingleObject(g_ServicePauseEvent, INFINITE);
        }

        if (!ReadDirectoryChangesW(
            hDir,
            buffer,
            sizeof(buffer),
            TRUE,
            FILE_NOTIFY_CHANGE_FILE_NAME | FILE_NOTIFY_CHANGE_DIR_NAME | FILE_NOTIFY_CHANGE_ATTRIBUTES | 
            FILE_NOTIFY_CHANGE_SIZE | FILE_NOTIFY_CHANGE_LAST_WRITE | FILE_NOTIFY_CHANGE_CREATION,
            &bytesReturned,
            NULL,
            NULL
        )) {
            LogMessage(logFile, "Error: Failed to read directory changes. Error code: %lu\n", GetLastError());
            break;
        }

        DWORD offset = 0;
        FILE_NOTIFY_INFORMATION* notify;
        do {
            notify = (FILE_NOTIFY_INFORMATION*)((char*)buffer + offset);

            char fileName[MAX_PATH];
            int fileNameLength = WideCharToMultiByte(
                CP_ACP, 0, 
                notify->FileName, notify->FileNameLength / sizeof(WCHAR), 
                fileName, MAX_PATH - 1, 
                NULL, NULL
            );
            fileName[fileNameLength] = '\0';

            switch (notify->Action) {
            case FILE_ACTION_ADDED:
                LogMessage(logFile, "File added: %s\n", fileName);
                break;
            case FILE_ACTION_REMOVED:
                LogMessage(logFile, "File deleted: %s\n", fileName);
                break;
            case FILE_ACTION_MODIFIED:
                LogMessage(logFile, "File modified: %s\n", fileName);
                break;
            case FILE_ACTION_RENAMED_OLD_NAME:
                LogMessage(logFile, "File renamed from: %s\n", fileName);
                break;
            case FILE_ACTION_RENAMED_NEW_NAME:
                LogMessage(logFile, "File renamed to: %s\n", fileName);
                break;
            default:
                LogMessage(logFile, "Unknown action: %s\n", fileName);
                break;
            }

            offset += notify->NextEntryOffset;
        } while (notify->NextEntryOffset != 0);
    }

    CloseHandle(hDir);
}


void WINAPI ServiceCtrlHandler(DWORD dwControl) {
    switch (dwControl) {
    case SERVICE_CONTROL_STOP:
        if (g_ServiceStatus.dwCurrentState != SERVICE_RUNNING && g_ServiceStatus.dwCurrentState != SERVICE_PAUSED)
            break;

        g_ServiceStatus.dwCurrentState = SERVICE_STOP_PENDING;
        SetServiceStatus(g_StatusHandle, &g_ServiceStatus);

        SetEvent(g_ServiceStopEvent);  // Сигнализируем, что нужно завершить работу
        LogMessage(serviceLogFile, "Service stop requested");
        break;

    case SERVICE_CONTROL_PAUSE:
        if (g_ServiceStatus.dwCurrentState != SERVICE_RUNNING)
            break;

        g_ServiceStatus.dwCurrentState = SERVICE_PAUSE_PENDING;
        SetServiceStatus(g_StatusHandle, &g_ServiceStatus);

        ResetEvent(g_ServicePauseEvent);
        g_ServiceStatus.dwCurrentState = SERVICE_PAUSED;
        SetServiceStatus(g_StatusHandle, &g_ServiceStatus);
        LogMessage(serviceLogFile, "Service paused");
        break;

    case SERVICE_CONTROL_CONTINUE:
        if (g_ServiceStatus.dwCurrentState != SERVICE_PAUSED)
            break;

        g_ServiceStatus.dwCurrentState = SERVICE_CONTINUE_PENDING;
        SetServiceStatus(g_StatusHandle, &g_ServiceStatus);

        SetEvent(g_ServicePauseEvent);
        g_ServiceStatus.dwCurrentState = SERVICE_RUNNING;
        SetServiceStatus(g_StatusHandle, &g_ServiceStatus);
        LogMessage(serviceLogFile, "Service continued");
        break;

    default:
        break;
    }
}

void WINAPI ServiceMain(DWORD argc, LPTSTR* argv) {
    const char* logDirectory = (argc >= 3) ? argv[2] : "E:\\Univer\\3_course\\SP\\Lab_09\\Service09\\log";
    const char* directoryPath = (argc >= 2) ? argv[1] : "E:\\Univer\\3_course\\SP\\Lab_09\\Service09\\folder";
    
    char logFilePath[MAX_PATH];
    char serviceLogFilePath[MAX_PATH];
    CreateLogFileNames(logFilePath, serviceLogFilePath, logDirectory);

    CreateDirectoryA(logDirectory, NULL);

    logFile = fopen(logFilePath, "w");
    serviceLogFile = fopen(serviceLogFilePath, "w");
    if (!logFile || !serviceLogFile) {
        return;
    }

    setvbuf(logFile, NULL, _IONBF, 0);
    setvbuf(serviceLogFile, NULL, _IONBF, 0);

    LogMessage(serviceLogFile, "Попытка запуска сервиса %s с параметрами %s, %s", SERVICE_NAME, logDirectory, directoryPath);

    if (!CreateDirectoryA(logDirectory, NULL))
    {
        if (GetLastError() == ERROR_ALREADY_EXISTS)
        {
            LogMessage(serviceLogFile, "Успех! %s обнаружил каталог %s", SERVICE_NAME, logDirectory);
        } else
        {
            LogMessage(serviceLogFile, "Попытка выполнения операции сервисом провалена! %s", strerror(GetLastError()));
            return;
        }
    } else
    {
        LogMessage(serviceLogFile, "Успех! %s создал каталог %s", SERVICE_NAME, logDirectory);
    }

    g_StatusHandle = RegisterServiceCtrlHandler(SERVICE_NAME, ServiceCtrlHandler);

    if (!g_StatusHandle) {
        LogMessage(serviceLogFile, "RegisterServiceCtrlHandler failed\n");
        return;
    }

    g_ServiceStatus.dwServiceType = SERVICE_WIN32_OWN_PROCESS;
    g_ServiceStatus.dwCurrentState = SERVICE_START_PENDING;
    g_ServiceStatus.dwControlsAccepted = SERVICE_ACCEPT_STOP | SERVICE_ACCEPT_PAUSE_CONTINUE;
    g_ServiceStatus.dwWin32ExitCode = 0;
    g_ServiceStatus.dwServiceSpecificExitCode = 0;
    g_ServiceStatus.dwCheckPoint = 0;

    SetServiceStatus(g_StatusHandle, &g_ServiceStatus);

    g_ServiceStopEvent = CreateEvent(NULL, TRUE, FALSE, NULL);
    g_ServicePauseEvent = CreateEvent(NULL, TRUE, TRUE, NULL);
    if (!g_ServiceStopEvent || !g_ServicePauseEvent) {
        g_ServiceStatus.dwCurrentState = SERVICE_STOPPED;
        g_ServiceStatus.dwWin32ExitCode = GetLastError();
        SetServiceStatus(g_StatusHandle, &g_ServiceStatus);
        LogMessage(serviceLogFile, "Error: CreateEvent failed (%d)\n", GetLastError());
        return;
    }

    DWORD attr = GetFileAttributesA(directoryPath);
    if (attr == INVALID_FILE_ATTRIBUTES || !(attr & FILE_ATTRIBUTE_DIRECTORY)) {
        g_ServiceStatus.dwCurrentState = SERVICE_STOPPED;
        g_ServiceStatus.dwWin32ExitCode = ERROR_PATH_NOT_FOUND;
        SetServiceStatus(g_StatusHandle, &g_ServiceStatus);
        LogMessage(serviceLogFile, "Error: Directory %s does not exist\n", directoryPath);
        return;
    }

    g_ServiceStatus.dwCurrentState = SERVICE_RUNNING;
    SetServiceStatus(g_StatusHandle, &g_ServiceStatus);

    LogMessage(serviceLogFile, "Service started\n");

    PrintDirectoryContentsRecursive(directoryPath);
    WatchDirectory(directoryPath);

    LogMessage(serviceLogFile, "Service stopped\n");

    CloseHandle(g_ServiceStopEvent);
    CloseHandle(g_ServicePauseEvent);
    g_ServiceStatus.dwCurrentState = SERVICE_STOPPED;
    SetServiceStatus(g_StatusHandle, &g_ServiceStatus);

    fclose(logFile);
    fclose(serviceLogFile);
}



int main(int argc, char* argv[])
{
    SERVICE_TABLE_ENTRY ServiceTable[] = {
        { SERVICE_NAME, ServiceMain },
        {NULL, NULL}
    };

    if (!StartServiceCtrlDispatcher(ServiceTable))
    {
        printf("Error: StartServiceCtrlDispatcher failed (%d)\n", (int)GetLastError());
        return 1;
    }

    return 0;
}

