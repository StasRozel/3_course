#ifndef MAPPINGS_H
#define MAPPINGS_H

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

extern HANDLE hFileMapping;
extern LPVOID pMapView;
extern int *listSize;

int OpenMapping(LPSTR filePath, LPINT listSize);
int AddRow(HANDLE hFileMapping, struct Student row, INT pos);
int RemRow(HANDLE hFileMapping, INT pos);
int PrintRow(HANDLE hFileMapping, INT pos);
void PrintRows(HANDLE hFileMapping);
void CloseMapping(HANDLE hFileMapping);

#endif 
