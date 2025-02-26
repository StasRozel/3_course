#define _CRT_SECURE_NO_WARNINGS
#include <windows.h>
#include <stdio.h>
#include <tchar.h>
#include <stdbool.h>

void PrintDirectoryContentsRecursive(const char* directoryPath) {
    WIN32_FIND_DATAA findData;
    char searchPath[MAX_PATH];
    snprintf(searchPath, MAX_PATH, "%s\\*", directoryPath);

    HANDLE hFind = FindFirstFileA(searchPath, &findData);

    if (hFind == INVALID_HANDLE_VALUE) {
        printf("Error: Unable to open directory %s\n", directoryPath);
        return;
    }

    do {
        if (strcmp(findData.cFileName, ".") != 0 && strcmp(findData.cFileName, "..") != 0) {
            char fullPath[MAX_PATH];
            snprintf(fullPath, MAX_PATH, "%s\\%s", directoryPath, findData.cFileName);

            if (findData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) {
                printf("Directory: %s\n", fullPath);
                PrintDirectoryContentsRecursive(fullPath);
            }
            else {
                printf("File: %s\n", fullPath);
            }
        }
    } while (FindNextFileA(hFind, &findData) != 0);

    FindClose(hFind);
}

void WatchDirectory(const char* directoryPath) {
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
        printf("Error: Unable to open directory %s\n", directoryPath);
        return;
    }

    printf("Watching for changes in directory and subdirectories: %s\n", directoryPath);

    char buffer[1024];
    DWORD bytesReturned;
    FILE_NOTIFY_INFORMATION* notify;

    while (true) {
        if (ReadDirectoryChangesW(
            hDir,
            buffer,
            sizeof(buffer),
            TRUE,                          
            FILE_NOTIFY_CHANGE_FILE_NAME | FILE_NOTIFY_CHANGE_DIR_NAME | FILE_NOTIFY_CHANGE_ATTRIBUTES | FILE_NOTIFY_CHANGE_SIZE | FILE_NOTIFY_CHANGE_LAST_WRITE | FILE_NOTIFY_CHANGE_CREATION,
            &bytesReturned,
            NULL,
            NULL) == 0) {
            printf("Error: Failed to read directory changes.\n");
            break;
        }

        int offset = 0;
        do {
            notify = (FILE_NOTIFY_INFORMATION*)((char*)buffer + offset);
            char fileName[MAX_PATH];
            wcstombs(fileName, notify->FileName, notify->FileNameLength / sizeof(WCHAR));
            fileName[notify->FileNameLength / sizeof(WCHAR)] = '\0';

            switch (notify->Action) {
            case FILE_ACTION_ADDED:
                printf("File added: %s\n", fileName);
                break;
            case FILE_ACTION_REMOVED:
                printf("File deleted: %s\n", fileName);
                break;
            case FILE_ACTION_MODIFIED:
                printf("File modified: %s\n", fileName);
                break;
            case FILE_ACTION_RENAMED_OLD_NAME:
                printf("File renamed from: %s\n", fileName);
                break;
            case FILE_ACTION_RENAMED_NEW_NAME:
                printf("File renamed to: %s\n", fileName);
                break;
            default:
                printf("Unknown action: %s\n", fileName);
            }

            offset += notify->NextEntryOffset;
        } while (notify->NextEntryOffset != 0);
    }

    CloseHandle(hDir);
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        printf("Usage: %s <directory_path>\n", argv[0]);
        return 1;
    }

    const char* directoryPath = argv[1];

    DWORD attributes = GetFileAttributesA(directoryPath);
    if (attributes == INVALID_FILE_ATTRIBUTES || !(attributes & FILE_ATTRIBUTE_DIRECTORY)) {
        printf("Error: Directory does not exist or is not accessible: %s\n", directoryPath);
        return 1;
    }

    printf("Contents of directory %s:\n", directoryPath);
    PrintDirectoryContentsRecursive(directoryPath);
    WatchDirectory(directoryPath);
    return 0;
}
