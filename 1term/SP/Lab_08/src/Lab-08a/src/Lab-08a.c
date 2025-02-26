#include <stdio.h>
#include <stdlib.h>
#include "mappings.h"

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
