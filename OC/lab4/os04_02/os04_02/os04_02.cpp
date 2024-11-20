#include <iostream>
#include <thread>
#include <chrono>
#include <windows.h>

void OS04_02_T1(DWORD processId) {
    for (int i = 0; i < 50; ++i) {
        DWORD threadId = GetCurrentThreadId();
        std::cout << "Thread T1 - Process: " << processId << ", Thread: " << threadId << " - Iteration" << i + 1 << std::endl;
        std::this_thread::sleep_for(std::chrono::seconds(1));
    }
}

void OS04_02_T2(DWORD processId) {
    for (int i = 0; i < 125; ++i) {
        DWORD threadId = GetCurrentThreadId();
        std::cout << "Thread T2 - Process: " << processId << ", Thread : " << threadId << " - Iteration" << i + 1 << std::endl;
        std::this_thread::sleep_for(std::chrono::seconds(1));
    }
}

int main()
{  
    DWORD processId = GetCurrentProcessId();
    std::cout << "Process ID: " << processId << std::endl;

    std::thread thread1(OS04_02_T1, processId);
    std::thread thread2(OS04_02_T2, processId);

    for (int i = 0; i < 100; ++i) {
        std::cout << "Main thread - Process: " << processId << " - Iteration" << i + 1 << std::endl;
        std::this_thread::sleep_for(std::chrono::seconds(1));
    }

    thread1.join();
    thread2.join();

    return 0;
}
