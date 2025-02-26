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

typedef int (*OpenMappingFunc)(LPSTR filePath, LPINT maxSize);
typedef int (*AddRowFunc)(struct Student row, INT pos);
typedef int (*RemRowFunc)(int pos);
typedef int (*PrintRowFunc)(int pos);
typedef void (*PrintRowsFunc)();
typedef void (*CloseMappingFunc)();
typedef void (*AbobaFunc)();


int main() {
    int maxSize = 100;
    char filePath[] = "students.txt";

    HMODULE hLib1 = LoadLibrary("../../mappingsd/Debug/mappings_def.dll");
    if (!hLib1) {
        DWORD dwError = GetLastError();
        printf("Error loading library: %lu\n", dwError);
        return 1;
    }

    HMODULE hLib2 = LoadLibrary("../../mappingsd-2/Debug/mappings_dllexport.dll");
    if (!hLib2) {
        printf("Failed to load mappings_dllexport.dll\n");
        FreeLibrary(hLib1);
        return 1;
    }

    OpenMappingFunc OpenMapping = (OpenMappingFunc)GetProcAddress(hLib1, (LPCSTR)1);
    AddRowFunc AddRow = (AddRowFunc)GetProcAddress(hLib1, (LPCSTR)2);
    RemRowFunc RemRow = (RemRowFunc)GetProcAddress(hLib1, (LPCSTR)3);
    PrintRowFunc PrintRow = (PrintRowFunc)GetProcAddress(hLib1, (LPCSTR)4);
    PrintRowsFunc PrintRows = (PrintRowsFunc)GetProcAddress(hLib1, (LPCSTR)5);
    CloseMappingFunc CloseMapping = (CloseMappingFunc)GetProcAddress(hLib1, (LPCSTR)6);
    AbobaFunc Aboba = (AbobaFunc)GetProcAddress(hLib2, "Aboba");

    if (!OpenMapping || !AddRow || !RemRow || !PrintRow || !PrintRows || !CloseMapping) {
        printf("Failed to get functions from the libraries\n");
        FreeLibrary(hLib1);
        FreeLibrary(hLib2);
        return 1;
    }

    if (OpenMapping(filePath, &maxSize)) {
        printf("Failed to open file mapping using OpenMapping.\n");
        FreeLibrary(hLib1);
        FreeLibrary(hLib2);
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

            if (AddRow(newStudent, pos) == 0) {
                Aboba();
                printf("Student added successfully using Mappingd.\n");
            }
            else {
                printf("Error adding student using Mappingd.\n");
            }
            break;
        }
        case 2: {
            int pos;
            printf("Enter position to remove: ");
            scanf_s("%d", &pos);

            if (RemRow(pos) == 0) {
                Aboba();
                printf("Record removed successfully using Mappingd.\n");
            }
            else {
                printf("Error removing record using Mappingd.\n");
            }
            break;
        }
        case 3: {
            int pos;
            printf("Enter position to display: ");
            scanf_s("%d", &pos);
            Aboba();
            if (PrintRow(pos) != 0) {
                printf("Error: invalid position or empty record using Mappingd.\n");
            }
            break;
        }
        case 4:
            PrintRows();
            printf("\n");
            Aboba();
            break;
        case 5: {
            CloseMapping();
            Aboba();
            FreeLibrary(hLib1);
            FreeLibrary(hLib2);
            return 0;
        }
        default:
            printf("Invalid choice.\n");
        }
    }
}
