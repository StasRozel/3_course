#define _CRT_SECURE_NO_WARNINGS
#include <windows.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_ROW_LENGTH 256

HANDLE hFile = INVALID_HANDLE_VALUE;
char* buffer = NULL;
DWORD bufferSize = MAX_ROW_LENGTH;

// Function prototypes
int MyOpenFile(LPSTR filePath);
int AddRow(LPSTR row, INT pos);
int RemRow(INT pos);
int PrintRow(INT pos);
void PrintRows();
int CloseFile();
int CountLines();

int main() {
    int choice, pos;
    char filePath[MAX_PATH];
    char row[MAX_ROW_LENGTH];

    SetConsoleCP(1251);
    SetConsoleOutputCP(1251);

    while (1) {
        printf("\nChoose operation:\n");
        printf("1. Open file.\n");
        printf("2. Add string.\n");
        printf("3. Remove string.\n");
        printf("4. Show string.\n");
        printf("5. Show file.\n");
        printf("6. Close file.\n");
        printf("0. Exit.\n");

        scanf("%d", &choice);
        getchar();

        switch (choice) {
        case 1:
            printf("Enter the path to file: ");
            fgets(filePath, MAX_PATH, stdin);
            filePath[strcspn(filePath, "\n")] = '\0';
            if (MyOpenFile(filePath) != 0) {
                printf("Error: Unable to open file.\n");
            }
            break;

        case 2:
            if (hFile == INVALID_HANDLE_VALUE) {
                printf("File not open.\n");
                break;
            }
            printf("Enter string: ");
            fgets(row, MAX_ROW_LENGTH, stdin);
            row[strcspn(row, "\n")] = '\0';
            printf("Enter position for add (-1 tail, 0 head): ");
            scanf("%d", &pos);
            getchar();
            if (AddRow(row, pos) != 0) {
                printf("Error: String not added.\n");
            }
            break;

        case 3:
            if (hFile == INVALID_HANDLE_VALUE) {
                printf("File not open.\n");
                break;
            }
            printf("Enter position for remove (-1 tail, 0 head): ");
            scanf("%d", &pos);
            getchar();
            if (RemRow(pos) != 0) {
                printf("Error: String not removed.\n");
            }
            break;

        case 4:
            if (hFile == INVALID_HANDLE_VALUE) {
                printf("File not open.\n");
                break;
            }
            printf("Enter position for show (-1 tail, 0 head): ");
            scanf("%d", &pos);
            getchar();
            if (PrintRow(pos) != 0) {
                printf("Error: String not shown.\n");
            }
            break;

        case 5:
            if (hFile == INVALID_HANDLE_VALUE) {
                printf("File not open.\n");
            }
            else {
                PrintRows();
            }
            break;

        case 6:
            if (CloseFile() != 0) {
                printf("Error: When closing the file\n");
            }
            break;

        case 0:
            if (hFile != INVALID_HANDLE_VALUE) {
                CloseFile();
            }
            return 0;

        default:
            printf("Incorrect choice.\n");
            break;
        }
    }
}

int MyOpenFile(LPSTR filePath) {
    hFile = CreateFile(filePath, GENERIC_READ | GENERIC_WRITE, 0, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
    if (hFile == INVALID_HANDLE_VALUE) {
        printf("The file cannot be opened: %s\n", filePath);
        return 1;
    }
    buffer = (char*)malloc(bufferSize);
    if (buffer == NULL) {
        CloseHandle(hFile);
        hFile = INVALID_HANDLE_VALUE;
        printf("Error: Memory allocation.\n");
        return 1;
    }
    return 0;
}


int AddRow(LPSTR row, INT pos) {
    if (hFile == INVALID_HANDLE_VALUE || row == NULL) {
        printf("Invalid handle or an empty string.\n");
        return 1;
    }

    DWORD fileSize = GetFileSize(hFile, NULL);
    if (fileSize == INVALID_FILE_SIZE) {
        printf("Error: Unable to get file size.\n");
        return 1;
    }

    if (fileSize == 0) {
        SetFilePointer(hFile, 0, NULL, FILE_BEGIN);
        DWORD bytesWritten;
        char tempBuffer[MAX_ROW_LENGTH];
        snprintf(tempBuffer, MAX_ROW_LENGTH, "%s\n", row);
        if (!WriteFile(hFile, tempBuffer, strlen(tempBuffer), &bytesWritten, NULL)) {
            printf("Error: Unable to write to file.\n");
            return 1;
        }
        return 0;
    }

    char* fileBuffer = (char*)malloc(fileSize + 1);
    if (fileBuffer == NULL) {
        printf("Error: Memory allocation.\n");
        return 1;
    }

    SetFilePointer(hFile, 0, NULL, FILE_BEGIN);
    DWORD bytesRead;
    ReadFile(hFile, fileBuffer, fileSize, &bytesRead, NULL);
    fileBuffer[fileSize] = '\0';

    int lineCount = CountLines();

    if (pos > lineCount + 1 || pos < -1) {
        printf("Incorrect position for inserting a string.\n");
        free(fileBuffer);
        return 1;
    }

    char* tempBuffer = (char*)malloc(fileSize + bufferSize);
    if (tempBuffer == NULL) {
        printf("Error: Memory allocation.\n");
        free(fileBuffer);
        return 1;
    }

    if (pos == -1) {
        snprintf(tempBuffer, fileSize + bufferSize, "%s%s\n", fileBuffer, row);
    } else if (pos == 0) {
        snprintf(tempBuffer, fileSize + bufferSize, "%s\n%s", row, fileBuffer);
    } else {
        int line = 1;
        DWORD i = 0;
        char* tempPtr = tempBuffer;
        while (i < fileSize && line < pos) {
            if (fileBuffer[i] == '\n') line++;
            *tempPtr++ = fileBuffer[i++];
        }
        snprintf(tempPtr, bufferSize, "%s\n", row);
        strcat(tempPtr, &fileBuffer[i]);
    }

    SetFilePointer(hFile, 0, NULL, FILE_BEGIN);
    DWORD bytesWritten;
    WriteFile(hFile, tempBuffer, strlen(tempBuffer), &bytesWritten, NULL);
    SetEndOfFile(hFile);

    free(fileBuffer);
    free(tempBuffer);
    return 0;
}


int RemRow(INT pos) {
    if (hFile == INVALID_HANDLE_VALUE) {
        printf("Invalid handle.\n");
        return 1;
    }

    DWORD fileSize = GetFileSize(hFile, NULL);
    char* fileBuffer = (char*)malloc(fileSize);
    if (fileBuffer == NULL) {
        printf("Error: Memory allocation.\n");
        return 1;
    }

    SetFilePointer(hFile, 0, NULL, FILE_BEGIN);
    DWORD bytesRead;
    ReadFile(hFile, fileBuffer, fileSize, &bytesRead, NULL);

    int lineCount = CountLines();

    if (pos > lineCount || pos < -1) {
        printf("Incorrect position for deleting a string.\n");
        free(fileBuffer);
        return 1;
    }

    char* tempBuffer = (char*)malloc(fileSize);
    if (tempBuffer == NULL) {
        printf("Error: Memory allocation.\n");
        free(fileBuffer);
        return 1;
    }

    SetFilePointer(hFile, 0, NULL, FILE_BEGIN);
    if (pos == 0) {
        int i = 0;
        while (fileBuffer[i] != '\n' && i < fileSize) i++;
        strcpy(tempBuffer, &fileBuffer[i + 1]);
    }
    else if (pos == -1) {
        int i = fileSize - 1;
        while (i > 0 && fileBuffer[i] != '\n') i--;
        strncpy(tempBuffer, fileBuffer, i);
        tempBuffer[i] = '\0';
    }
    else {
        int line = 1;
        DWORD i = 0, j = 0;
        while (i < fileSize) {
            if (line == pos) {
                while (fileBuffer[i] != '\n' && i < fileSize) i++;
                i++;
            }
            else {
                tempBuffer[j++] = fileBuffer[i++];
            }
            if (fileBuffer[i - 1] == '\n') line++;
        }
        tempBuffer[j] = '\0';
    }

    SetFilePointer(hFile, 0, NULL, FILE_BEGIN);
    DWORD bytesWritten;
    WriteFile(hFile, tempBuffer, strlen(tempBuffer), &bytesWritten, NULL);
    SetEndOfFile(hFile);

    free(fileBuffer);
    free(tempBuffer);
    return 0;
}

int PrintRow(INT pos) {
    if (hFile == INVALID_HANDLE_VALUE) {
        printf("Invalid handle.\n");
        return 1;
    }

    DWORD fileSize = GetFileSize(hFile, NULL);
    char* fileBuffer = (char*)malloc(fileSize + 1);
    if (fileBuffer == NULL) {
        printf("Error: Memory allocation.\n");
        return 1;
    }

    SetFilePointer(hFile, 0, NULL, FILE_BEGIN);
    DWORD bytesRead;
    ReadFile(hFile, fileBuffer, fileSize, &bytesRead, NULL);
    fileBuffer[fileSize] = '\0';

    int lineCount = CountLines();

    if (pos > lineCount || pos < -1) {
        printf("Incorrect position for string output.\n");
        free(fileBuffer);
        return 1;
    }

    char* lineStart = fileBuffer;
    if (pos == 0) {
        lineStart = fileBuffer;
    }
    else if (pos == -1) {
        lineStart = strrchr(fileBuffer, '\n');
        if (lineStart != NULL) lineStart++;
    }
    else {
        int line = 1;
        while (line < pos) {
            lineStart = strchr(lineStart, '\n');
            if (lineStart != NULL) lineStart++;
            line++;
        }
    }

    if (lineStart != NULL) {
        char* lineEnd = strchr(lineStart, '\n');
        if (lineEnd != NULL) {
            *lineEnd = '\0';
        }
        printf("String %d: %s\n", pos, lineStart);
    }
    else {
        printf("String not found.\n");
    }

    free(fileBuffer);
    return 0;
}

void PrintRows() {
    if (hFile == INVALID_HANDLE_VALUE) {
        printf("Error: File not open\n");
        return;
    }

    DWORD fileSize = GetFileSize(hFile, NULL);
    char* fileBuffer = (char*)malloc(fileSize + 1);
    if (fileBuffer == NULL) {
        printf("Error: Memory allocation.\n");
        return;
    }

    SetFilePointer(hFile, 0, NULL, FILE_BEGIN);
    DWORD bytesRead;
    ReadFile(hFile, fileBuffer, fileSize, &bytesRead, NULL);
    fileBuffer[fileSize] = '\0';

    printf("File content:\n%s\n", fileBuffer);
    free(fileBuffer);
}

int CountLines() {
    if (hFile == INVALID_HANDLE_VALUE) return -1;

    DWORD fileSize = GetFileSize(hFile, NULL);
    char* fileBuffer = (char*)malloc(fileSize);
    if (fileBuffer == NULL) return -1;

    SetFilePointer(hFile, 0, NULL, FILE_BEGIN);
    DWORD bytesRead;
    ReadFile(hFile, fileBuffer, fileSize, &bytesRead, NULL);

    int lineCount = 0;
    for (DWORD i = 0; i < fileSize; i++) {
        if (fileBuffer[i] == '\n') lineCount++;
    }
    free(fileBuffer);
    return lineCount;
}

int CloseFile() {
    if (hFile == INVALID_HANDLE_VALUE) {
        printf("File already close.\n");
        return 1;
    }
    CloseHandle(hFile);
    hFile = INVALID_HANDLE_VALUE;
    if (buffer != NULL) {
        free(buffer);
        buffer = NULL;
    }
    return 0;
}
