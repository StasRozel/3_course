#define WIN32_LEAN_AND_MEAN 
#define _CRT_SECURE_NO_WARNINGS
#include <Windows.h>
#include <processthreadsapi.h>
#include <stdio.h>
#include <stdlib.h>


int main(int argc, char* argv[])
{   
    int proc_number = 0;
    if (argc < 2) {
        char* iter_num = getenv("ITER_NUM");

        proc_number = atoi(iter_num);
        if (proc_number < 0) {
            ExitProcess(0);
        }
    }
    else {
        proc_number = atoi(argv[1]);
    }
    
     
    for (int i = 0; i < proc_number; i++)
    {
        printf("%d\n", i+1);
      
        printf("Process ID (PID) of the new process: %lu\n", GetCurrentProcessId);
        Sleep(500);
      
        
    }

    ExitProcess(0);
}