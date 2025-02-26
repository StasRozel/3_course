#include <stdio.h>
#include <stdlib.h>
#include <windows.h>
#include <stdbool.h>

void create_child_process(int lower, int upper, HANDLE hWrite, const char* mutex_name) {
    char cmd[256];
    snprintf(cmd, sizeof(cmd), "Lab-03a-client.exe %d %d %s", lower, upper, mutex_name);

    STARTUPINFO si;
    PROCESS_INFORMATION processInfo;
    ZeroMemory(&si, sizeof(STARTUPINFO));
    si.cb = sizeof(STARTUPINFO);
    si.hStdOutput = hWrite;
    si.dwFlags |= STARTF_USESTDHANDLES;
    ZeroMemory(&processInfo, sizeof(processInfo));

    if (!CreateProcess(NULL, cmd, NULL, NULL, TRUE, CREATE_NEW_CONSOLE, NULL, NULL, &si, &processInfo)) {
        fprintf(stderr, "Error creating child process: %lu\n", GetLastError());
    } else {
        printf("Process created\n");
        CloseHandle(processInfo.hProcess);
        CloseHandle(processInfo.hThread);
    }
}

int main(int argc, char* argv[]) {
    if (argc < 4 || argc > 5) {
        fprintf(stderr, "Usage: %s <Num Processes> <Lower Bound> <Upper Bound> [Mutex Name]\n", argv[0]);
        return EXIT_FAILURE;
    }

    int num_processes = atoi(argv[1]);
    int lower = atoi(argv[2]);
    int upper = atoi(argv[3]);
    if (lower > upper) {
        fprintf(stderr, "Error: Lower bound must be less than or equal to upper bound.\n");
        return EXIT_FAILURE;
    }
    const char* default_mutex_name = "DefaultMutex";
    const char env_mutex_name[256];
    DWORD len = GetEnvironmentVariable("LAB03A_MUTEX_NAME", env_mutex_name, sizeof(env_mutex_name));
    const char* mutex_name = (argc >= 5) ? argv[4] : (len > 0 ? env_mutex_name : default_mutex_name);

    HANDLE hMutex = CreateMutex(NULL, FALSE, mutex_name);
    if (!hMutex) {
        fprintf(stderr, "Error creating mutex: %lu\n", GetLastError());
        return EXIT_FAILURE;
    }

    HANDLE* pipesReadHandles = malloc(sizeof(HANDLE) * num_processes);
    if (pipesReadHandles == NULL) {
        fprintf(stderr, "Memory allocation error\n");
        CloseHandle(hMutex);
        return EXIT_FAILURE;
    }

    int range = upper - lower + 1;
    int range_per_process = range / num_processes;
    int extra = range % num_processes;

    for (int i = 0; i < num_processes; i++) {
        HANDLE hWrite;
        SECURITY_ATTRIBUTES sa = { sizeof(SECURITY_ATTRIBUTES), NULL, TRUE };

        if (!CreatePipe(&pipesReadHandles[i], &hWrite, &sa, 0)) {
            fprintf(stderr, "Error creating pipe: %lu\n", GetLastError());
            CloseHandle(hMutex);
            free(pipesReadHandles);
            return EXIT_FAILURE;
        }

        int process_lower = lower + i * range_per_process;
        int process_upper = process_lower + range_per_process - 1;

        if (i == num_processes - 1) {
            process_upper += extra;
        }

        printf("Creating child process %d with range [%d, %d]...\n", i + 1, process_lower, process_upper);
        create_child_process(process_lower, process_upper, hWrite, mutex_name);
        CloseHandle(hWrite);
    }

    Sleep(1000);
    for (int i = 0; i < num_processes; i++) {
        WaitForSingleObject(hMutex, INFINITE);

        DWORD bytesRead;
        int count = 0;
        int* primes = NULL;
        if (ReadFile(pipesReadHandles[i], &count, sizeof(count), &bytesRead, NULL) && bytesRead == sizeof(count)) {
            ReleaseMutex(hMutex);
            printf("Count of primes: %d\n", count);
            if (count > 0) {
                primes = malloc(count * sizeof(int));
                Sleep(1000);
                WaitForSingleObject(hMutex, INFINITE);
                if (primes && ReadFile(pipesReadHandles[i], primes, sizeof(int) * count, &bytesRead, NULL) && bytesRead == sizeof(int) * count) {
                    ReleaseMutex(hMutex);
                    printf("Process %d found primes:\n", i + 1);
                    for (int j = 0; j < count; j++) {
                        printf("%d ", primes[j]);
                    }
                    printf("\n");
                }
                else {
                    fprintf(stderr, "Error reading primes from pipe: %lu\n", GetLastError());
                }
                free(primes);
            }
        }
        else {
            fprintf(stderr, "Error reading count from pipe for process %d: %lu\n", i + 1, GetLastError());
        }

        ReleaseMutex(hMutex);
        CloseHandle(pipesReadHandles[i]);
    }

    free(pipesReadHandles);
    CloseHandle(hMutex);
    return EXIT_SUCCESS;
}