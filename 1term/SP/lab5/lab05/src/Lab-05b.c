#include <windows.h>
#include <stdio.h>

#define PAGE_COUNT 256

int main() {
    SYSTEM_INFO sysInfo;
    GetSystemInfo(&sysInfo);

    DWORD pageSize = sysInfo.dwPageSize;
    printf("Page size: %lu bytes\n", pageSize);

    void* baseAddress = VirtualAlloc(NULL, PAGE_COUNT * pageSize, MEM_RESERVE, PAGE_NOACCESS);
    if (!baseAddress) {
        printf("Failed to reserve memory. Error: %lu\n", GetLastError());
        return 1;
    }
    printf("Reserved memory at address: %p\n", baseAddress);
    printf("Press Enter to continue...\n");
    getchar();

    void* allocatedMemory = VirtualAlloc((BYTE*)baseAddress + (PAGE_COUNT / 2) * pageSize, 
                                         (PAGE_COUNT / 2) * pageSize, MEM_COMMIT, PAGE_READWRITE);
    if (!allocatedMemory) {
        printf("Failed to commit memory. Error: %lu\n", GetLastError());
        VirtualFree(baseAddress, 0, MEM_RELEASE);
        return 1;
    }
    printf("Committed memory at address: %p\n", allocatedMemory);
    printf("Press Enter to continue...\n");
    getchar();

    int* intArray = (int*)allocatedMemory;
    for (int i = 0; i < (PAGE_COUNT / 2) * pageSize / sizeof(int); i++) {
        intArray[i] = i;
    }
    printf("Filled memory with integers starting from 0.\n");
    printf("Press Enter to continue...\n");
    getchar();

    if (!VirtualProtect(allocatedMemory, (PAGE_COUNT / 2) * pageSize, PAGE_READONLY, &pageSize)) {
        printf("Failed to change memory protection. Error: %lu\n", GetLastError());
    } else {
        printf("Changed memory protection to read-only.\n");
    }
    printf("Press Enter to continue...\n");
    getchar();

    if (!VirtualFree(allocatedMemory, (PAGE_COUNT / 2) * pageSize, MEM_DECOMMIT)) {
        printf("Failed to decommit memory. Error: %lu\n", GetLastError());
    } else {
        printf("Decommitted physical memory.\n");
    }
    printf("Press Enter to continue...\n");
    getchar();

    if (!VirtualFree(baseAddress, 0, MEM_RELEASE)) {
        printf("Failed to release memory. Error: %lu\n", GetLastError());
    } else {
        printf("Released virtual memory.\n");
    }

    return 0;
}
