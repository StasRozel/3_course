#include <windows.h>
#include <stdio.h>

#define BLOCK_COUNT 10
#define BLOCK_SIZE (512 * 1024)

void HeapInfo(HANDLE heap) {
    PROCESS_HEAP_ENTRY entry;
    entry.lpData = NULL;

    SIZE_T totalSize = 0;
    printf("=== Heap Information ===\n");

    while (HeapWalk(heap, &entry)) {
        totalSize += entry.cbData;
        printf("Address: %p, Size: %zu bytes, ", entry.lpData, entry.cbData);

        if (entry.wFlags & PROCESS_HEAP_ENTRY_BUSY) {
            printf("Type: Allocated\n");
        } else if (entry.wFlags & PROCESS_HEAP_REGION) {
            printf("Type: Region\n");
        } else if (entry.wFlags & PROCESS_HEAP_UNCOMMITTED_RANGE) {
            printf("Type: Uncommitted\n");
        } else {
            printf("Type: Free\n");
        }
    }

    printf("Total Heap Size: %zu bytes\n", totalSize);
    printf("========================\n");

    if (GetLastError() != ERROR_NO_MORE_ITEMS) {
        printf("HeapWalk failed. Error: %lu\n", GetLastError());
    }
}

int main() {
    HANDLE heap = HeapCreate(0, 1 * 1024 * 1024, 8 * 1024 * 1024);
    if (!heap) {
        printf("Failed to create heap. Error: %lu\n", GetLastError());
        return 1;
    }
    printf("Heap created.\n");
    HeapInfo(heap);
    system("pause & cls");

    void* blocks[BLOCK_COUNT];
    for (int i = 0; i < BLOCK_COUNT; i++) {
        blocks[i] = HeapAlloc(heap, HEAP_ZERO_MEMORY, BLOCK_SIZE);
        if (!blocks[i]) {
            printf("Failed to allocate memory for block %d. Error: %lu\n", i, GetLastError());
            break;
        }
        printf("Allocated block %d at address: %p\n", i, blocks[i]);
        HeapInfo(heap);
        system("pause & cls");
    }

    for (int i = 0; i < BLOCK_COUNT; i++) {
        if (blocks[i]) {
            int* intArray = (int*)blocks[i];
            for (int j = 0; j < BLOCK_SIZE / sizeof(int); j++) {
                intArray[j] = j;
            }
        }
    }
    printf("Blocks filled with integers.\n");
    system("pause & cls");

    for (int i = 0; i < BLOCK_COUNT; i++) {
        if (blocks[i]) {
            if (HeapFree(heap, 0, blocks[i])) {
                printf("Freed block %d at address: %p\n", i, blocks[i]);
            } else {
                printf("Failed to free block %d. Error: %lu\n", i, GetLastError());
            }
        }
    }
    HeapInfo(heap);
    system("pause & cls");

    if (HeapDestroy(heap)) {
        printf("Heap destroyed.\n");
    } else {
        printf("Failed to destroy heap. Error: %lu\n", GetLastError());
    }

    return 0;
}

