#include <stdio.h>
#include <stdlib.h>


char* reverse(const char* s) {
    int lenght = 0;
    while (s[lenght] != '\0') {
        lenght++;
    }
    int l = 0;
    while (s[l] == ' ') {
        l++;
    }

    if (lenght == 0) {
        return "String is empty";
    }

    if (l == lenght) {
        return "String is empty";
    }

    char* buffStr = (char*)malloc(lenght + 1); 
    if (buffStr == NULL) {
        return NULL; 
    }

    for (int i = 0; i < lenght; i++) {
        buffStr[i] = s[lenght - 1 - i];
    }
    buffStr[lenght] = '\0';

    return buffStr;
}

int main(int argc, char** argv) {
    if (argc < 2) {
        printf("Usage: %s <string>\n", argv[0]);
        return 1;
    }
    printf("---------Testing------------\n");
    printf("Test #1: %s\n", reverse("dfaa23"));
    printf("Test #2: %s\n", reverse(""));
    printf("Test #3: %s\n", reverse("        "));
    printf("Test #4: %s\n", reverse("dad"));
    printf("Test #5: %s\n", reverse("1945"));
    printf("----------------------------\n");

    char* newStr = reverse(argv[1]);
    if (newStr == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        return 1;
    }

    printf("Intro string from cmd: %s\n", newStr); 
    free(newStr); 

    return 0;
}