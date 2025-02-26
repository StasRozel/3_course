#include <stdio.h>
#include <stdlib.h>
#include <windows.h>

struct Student {
    char Name[64];
    char Surname[128];
    unsigned char Course;
    unsigned char Group;
    char ID[8];
};

#define MAX_STUDENTS 100
#define STUDENT_SIZE sizeof(struct Student)

HANDLE hFileMapping = NULL;
LPVOID pMapView = NULL;
int *listSize = NULL;

int OpenMapping(LPSTR filePath, LPINT listSize);
int AddRow(HANDLE hFileMapping, struct Student row, INT pos);
int RemRow(HANDLE hFileMapping, INT pos);
int PrintRow(HANDLE hFileMapping, INT pos);
void PrintRows(HANDLE hFileMapping);
void CloseMapping(HANDLE hFileMapping);

int main() {
    int maxSize = MAX_STUDENTS;
    char filePath[] = "students.txt";

    if (OpenMapping(filePath, &maxSize)) {
        printf("Failed to open file mapping.\n");
        return 1;
    }

    int choice;
    while (1) {
        printf("\nMenu:\n");
        printf("1. Add record\n");
        printf("2. Remove record\n");
        printf("3. Show record\n");
        printf("4. Show all records\n");
        printf("5. Exit\n");
        printf("Choose an action: ");
        scanf_s("%d", &choice);

        switch (choice) {
        case 1: {
            struct Student newStudent;
            printf("Enter name: ");
            scanf_s("%63s", newStudent.Name, (unsigned)_countof(newStudent.Name));
            printf("Enter surname: ");
            scanf_s("%127s", newStudent.Surname, (unsigned)_countof(newStudent.Surname));
            printf("Enter course: ");
            scanf_s("%hhu", &newStudent.Course);
            printf("Enter group: ");
            scanf_s("%hhu", &newStudent.Group);
            printf("Enter ID: ");
            scanf_s("%7s", newStudent.ID, (unsigned)_countof(newStudent.ID));

            int pos;
            printf("Enter position for adding (-1 to add at the end): ");
            scanf_s("%d", &pos);

            if (AddRow(hFileMapping, newStudent, pos) == 0) {
                printf("Student added successfully.\n");
            }
            else {
                printf("Error adding student.\n");
            }
            break;
        }
        case 2: {
            int pos;
            printf("Enter position to remove: ");
            scanf_s("%d", &pos);

            if (RemRow(hFileMapping, pos) == 0) {
                printf("Record removed successfully.\n");
            }
            else {
                printf("Error removing record.\n");
            }
            break;
        }
        case 3: {
            int pos;
            printf("Enter position to display: ");
            scanf_s("%d", &pos);

            if (PrintRow(hFileMapping, pos) != 0) {
                printf("Error: invalid position or empty record.\n");
            }
            break;
        }
        case 4:
            PrintRows(hFileMapping);
            break;
        case 5:
            CloseMapping(hFileMapping);
            printf("Exiting the program.\n");
            return 0;
        default:
            printf("Invalid choice.\n");
        }
    }
}

int OpenMapping(LPSTR filePath, LPINT maxSize) {
    HANDLE hFile = CreateFile(L"filePath", GENERIC_READ | GENERIC_WRITE, 0, NULL, OPEN_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
    if (hFile == INVALID_HANDLE_VALUE) {
        printf("Error opening file.\n");
        return 1;
    }

    DWORD fileSize = sizeof(int) + (*maxSize) * STUDENT_SIZE;
    hFileMapping = CreateFileMapping(hFile, NULL, PAGE_READWRITE, 0, fileSize, L"filePath");
    if (hFileMapping == NULL) {
        printf("Error creating file mapping object.\n");
        CloseHandle(hFile);
        return 1;
    }

    pMapView = MapViewOfFile(hFileMapping, FILE_MAP_ALL_ACCESS, 0, 0, fileSize);
    if (pMapView == NULL) {
        printf("Error mapping the view of the file.\n");
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
    if (hFileMapping == NULL || pMapView == NULL) return 1;

    struct Student* students = (struct Student*)((char*)pMapView + sizeof(int));
    if (pos < 0) pos = (*listSize) + pos;

    if (pos >= *listSize || pos < 0) {
        printf("Invalid position.\n");
        return 1;
    }

    if (students[pos].ID[0] != '\0') {
        printf("Position is already occupied.\n");
        return 1;
    }

    students[pos] = row;
    return 0;
}

int RemRow(HANDLE hFileMapping, INT pos) {
    if (hFileMapping == NULL || pMapView == NULL) return 1;

    struct Student* students = (struct Student*)((char*)pMapView + sizeof(int));
    if (pos < 0) pos = (*listSize) + pos;

    if (pos >= *listSize || pos < 0) {
        printf("Invalid position.\n");
        return 1;
    }

    if (students[pos].ID[0] == '\0') {
        printf("Position is empty.\n");
        return 1;
    }

    ZeroMemory(&students[pos], STUDENT_SIZE);
    return 0;
}

int PrintRow(HANDLE hFileMapping, INT pos) {
    if (hFileMapping == NULL || pMapView == NULL) return 1;

    struct Student* students = (struct Student*)((char*)pMapView + sizeof(int));
    if (pos < 0) pos = (*listSize) + pos;

    if (pos >= *listSize || pos < 0 || students[pos].ID[0] == '\0') {
        printf("Invalid position or empty position.\n");
        return 1;
    }

    printf("Name: %s, Surname: %s, Course: %d, Group: %d, ID: %s\n",
        students[pos].Name, students[pos].Surname, students[pos].Course, students[pos].Group, students[pos].ID);
    return 0;
}

void PrintRows(HANDLE hFileMapping) {
    if (hFileMapping == NULL || pMapView == NULL) {
        printf("Error accessing file mapping.\n");
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
