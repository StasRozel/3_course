#define _CRT_SECURE_NO_WARNINGS
#include <windows.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void PrintInfo(LPSTR FileName);
void PrintText(LPSTR FileName);
BOOL IsBinaryFile(LPSTR FileName);

int main(int argc, char* argv[]) {
    if (argc < 2) {
        printf("Usage: %s <filename>\n", argv[0]);
        return 1;
    }

    PrintInfo(argv[1]);
    PrintText(argv[1]);

    return 0;
}

void PrintInfo(LPSTR FileName) {
    WIN32_FILE_ATTRIBUTE_DATA fileInfo;
    if (!GetFileAttributesEx(FileName, GetFileExInfoStandard, &fileInfo)) {
        printf("Unable to get file attributes: %s\n", FileName);
        return;
    }

    FILE* file = fopen(FileName, "rb");
    if (!file) {
        printf("Unable to open file: %s\n", FileName);
        return;
    }

    fseek(file, 0, SEEK_END);
    long fileSize = ftell(file);
    fseek(file, 0, SEEK_SET);
    fclose(file);

    printf("File Name: %s\n", FileName);
    printf("File Size: %ld B, %.2f KiB, %.2f MiB\n", fileSize, fileSize / 1024.0, fileSize / (1024.0 * 1024.0));
    printf("File Type: %s\n", (fileInfo.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) ? "Directory" : "File");

    SYSTEMTIME stUTC, stLocal;
    FileTimeToSystemTime(&fileInfo.ftCreationTime, &stUTC);
    SystemTimeToTzSpecificLocalTime(NULL, &stUTC, &stLocal);
    printf("Creation Time: %02d/%02d/%d %02d:%02d:%02d\n", stLocal.wDay, stLocal.wMonth, stLocal.wYear, stLocal.wHour, stLocal.wMinute, stLocal.wSecond);

    FileTimeToSystemTime(&fileInfo.ftLastAccessTime, &stUTC);
    SystemTimeToTzSpecificLocalTime(NULL, &stUTC, &stLocal);
    printf("Last Access Time: %02d/%02d/%d %02d:%02d:%02d\n", stLocal.wDay, stLocal.wMonth, stLocal.wYear, stLocal.wHour, stLocal.wMinute, stLocal.wSecond);

    FileTimeToSystemTime(&fileInfo.ftLastWriteTime, &stUTC);
    SystemTimeToTzSpecificLocalTime(NULL, &stUTC, &stLocal);
    printf("Last Write Time: %02d/%02d/%d %02d:%02d:%02d\n", stLocal.wDay, stLocal.wMonth, stLocal.wYear, stLocal.wHour, stLocal.wMinute, stLocal.wSecond);

    if (IsBinaryFile(FileName)) {
        printf("File Type: Binary\n");
    }
    else {
        printf("File Type: Text\n");
    }
}

void PrintText(LPSTR FileName) {
    if (IsBinaryFile(FileName)) {
        printf("The specified file is not a text file.\n");
        return;
    }

    FILE* file = fopen(FileName, "r");
    if (!file) {
        printf("Unable to open file: %s\n", FileName);
        return;
    }

    char ch;
    while ((ch = fgetc(file)) != EOF) {
        putchar(ch);
    }

    fclose(file);
}

BOOL IsBinaryFile(LPSTR FileName) {
    FILE* file = fopen(FileName, "rb");
    if (!file) {
        return TRUE;
    }

    char buffer[512];
    size_t bytesRead = fread(buffer, 1, sizeof(buffer), file);
    fclose(file);

    for (size_t i = 0; i < bytesRead; i++) {
        if (buffer[i] == 0) {
            return TRUE;
        }
    }

    return FALSE;
}
