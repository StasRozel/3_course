#include <iostream>
#include <iomanip>
#include <ctime>

using namespace std;

int main() {
    time_t t = time(nullptr);
    tm localTime;

    localtime_s(&localTime, &t);

    cout << put_time(&localTime, "%d.%m.%Y %H:%M:%S") << endl;

    return 0;
}