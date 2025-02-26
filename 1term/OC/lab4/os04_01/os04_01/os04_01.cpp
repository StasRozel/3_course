#include <iostream>
#include <thread>
#include <chrono>
#include <windows.h>

int main() 
{
    DWORD processId = GetCurrentProcessId();
    DWORD threadId = GetCurrentThreadId();

    std::cout << "Process Id: " << processId << std::endl;
    std::cout << "Thread Id: " << threadId << std::endl;

    for (int i = 0; i < 1000; i++) {
        std::cout << "Process: " << processId << ", Thread: " << threadId << " - Work..." << std::endl;
        std::this_thread::sleep_for(std::chrono::seconds(1));
    }

    return 0;
}
