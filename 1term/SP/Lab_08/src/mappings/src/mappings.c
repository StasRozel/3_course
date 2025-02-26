#include "Mappings.h"
#include <stdio.h>
#include <stdlib.h>
#include <windows.h>

HANDLE hFileMapping = NULL;
LPVOID pMapView = NULL;
int *listSize = NULL;

int OpenMapping(LPSTR filePath, LPINT maxSize) {
    HANDLE hFile = CreateFile(filePath, GENERIC_READ | GENERIC_WRITE, 0, NULL, OPEN_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
    if (hFile == INVALID_HANDLE_VALUE) {
        fprintf(stderr, "Error: Failed to open file.\n");
        return 1;
    }

    DWORD fileSize = sizeof(int) + (*maxSize) * STUDENT_SIZE;
    hFileMapping = CreateFileMapping(hFile, NULL, PAGE_READWRITE, 0, fileSize, NULL);
    if (hFileMapping == NULL) {
        fprintf(stderr, "Error: Failed to create file mapping object.\n");
        CloseHandle(hFile);
        return 1;
    }

    pMapView = MapViewOfFile(hFileMapping, FILE_MAP_ALL_ACCESS, 0, 0, fileSize);
    if (pMapView == NULL) {
        fprintf(stderr, "Error: Failed to map view of file.\n");
        CloseHandle(hFileMapping);
        CloseHandle(hFile);
        return 1;
    }

    listSize = (int*)pMapView;
    if (*listSize == 0) *listSize = *maxSize;

    CloseHandle(hFile);
    return 0;
}

int AddRow(HANDLE hFileMapping, struct Student row, INT pos) {
    if (hFileMapping == NULL || pMapView == NULL) {
        fprintf(stderr, "Error: File mapping not initialized.\n");
        return 1;
    }

    struct Student* students = (struct Student*)((char*)pMapView + sizeof(int));
    if (pos < 0) pos = (*listSize) + pos;

    if (pos >= *listSize || pos < 0) {
        fprintf(stderr, "Error: Invalid position.\n");
        return 1;
    }

    if (students[pos].ID[0] != '\0') {
        fprintf(stderr, "Error: Position already occupied.\n");
        return 1;
    }

    students[pos] = row;
    return 0;
}

int RemRow(HANDLE hFileMapping, INT pos) {
    if (hFileMapping == NULL || pMapView == NULL) {
        fprintf(stderr, "Error: File mapping not initialized.\n");
        return 1;
    }

    struct Student* students = (struct Student*)((char*)pMapView + sizeof(int));
    if (pos < 0) pos = (*listSize) + pos;

    if (pos >= *listSize || pos < 0) {
        fprintf(stderr, "Error: Invalid position.\n");
        return 1;
    }

    if (students[pos].ID[0] == '\0') {
        fprintf(stderr, "Error: Position is empty.\n");
        return 1;
    }

    ZeroMemory(&students[pos], STUDENT_SIZE);
    return 0;
}

int PrintRow(HANDLE hFileMapping, INT pos) {
    if (hFileMapping == NULL || pMapView == NULL) {
        fprintf(stderr, "Error: File mapping not initialized.\n");
        return 1;
    }

    struct Student* students = (struct Student*)((char*)pMapView + sizeof(int));
    if (pos < 0) pos = (*listSize) + pos;

    if (pos >= *listSize || pos < 0 || students[pos].ID[0] == '\0') {
        fprintf(stderr, "Error: Invalid position or position is empty.\n");
        return 1;
    }

    printf("Name: %s, Surname: %s, Course: %d, Group: %d, ID: %s\n",
           students[pos].Name, students[pos].Surname, students[pos].Course, students[pos].Group, students[pos].ID);
    return 0;
}

void PrintRows(HANDLE hFileMapping) {
    if (hFileMapping == NULL || pMapView == NULL) {
        fprintf(stderr, "Error: File mapping not initialized.\n");
        return;
    }

    struct Student* students = (struct Student*)((char*)pMapView + sizeof(int));
    for (int i = 0; i < *listSize; i++) {
        if (students[i].ID[0] != '\0') {
            printf("Record %d: ", i);
            PrintRow(hFileMapping, i);
        }
    }
}

void CloseMapping(HANDLE hFileMapping) {
    if (pMapView != NULL) UnmapViewOfFile(pMapView);
    if (hFileMapping != NULL) CloseHandle(hFileMapping);

    hFileMapping = NULL;
    pMapView = NULL;
}
