#include <Windows.h>
#include <iostream>

using namespace std;

void CALLBACK PrintIterations(LPVOID lpArg, DWORD dwTimerLowValue, DWORD dwTimerHighValue) {
    int* counter = reinterpret_cast<int*>(lpArg);
    cout << "Итерации: " << *counter << endl;
}

void infintyCycle(int& counter, DWORD startTime) {
    while (true) {
        counter++;

        if (GetTickCount64() - startTime >= 15000)
            break;

        SleepEx(0, TRUE);
    }
}

int main() {
    SetConsoleOutputCP(1251);
    SetConsoleCP(1251);

    HANDLE hTimer = CreateWaitableTimer(NULL, FALSE, NULL);
    LARGE_INTEGER Time;
    Time.QuadPart = -10000000;
    if (hTimer == NULL) {
        cout << "Ошибка создания таймера" << endl;
        return 1;
    }

    int counter = 0;
    DWORD startTime = GetTickCount64();

    if (!SetWaitableTimer(hTimer, &Time, 3000, PrintIterations, &counter, TRUE)) {
        cout << "Ошибка установки таймера" << endl;
        CloseHandle(hTimer);
        return 1;
    }

    infintyCycle(counter, startTime);
    
    cout << "Итоговое количество итераций: " << counter << endl;

    CancelWaitableTimer(hTimer);
    CloseHandle(hTimer);

    return 0;
}
