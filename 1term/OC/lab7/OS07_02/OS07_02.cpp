#include <Windows.h>
#include <iostream>
#include <ctime>
using namespace std;


void checkK(clock_t start, bool& flag, int k, int time) {
	if ((clock() - start) / CLOCKS_PER_SEC == time && flag) {
		cout << "After " << time << "s: " << k << '\n';
		flag = false;
	}
}

int main()
{
	clock_t start = clock();
	int k = 0;
	bool flag5sec = true, flag10sec = true;

	while (true)
	{
		k++;

		checkK(start, flag5sec, k, 5);

		checkK(start, flag10sec, k, 10);

		if ((clock() - start) / CLOCKS_PER_SEC == 15) {
			cout << "After 15s: " << k << '\n';
			break;
		}
	}

	return 0;
}