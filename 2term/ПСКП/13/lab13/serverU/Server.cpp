#include <winsock2.h>
#include <iostream>
#include <string>

#pragma comment(lib, "ws2_32.lib")

using namespace std;

string SetErrorMsgText(const string msg, int code) {
    return msg + " " + to_string(code);
}

int main() {
    setlocale(LC_ALL, "rus");
    WSADATA wsaData;
    SOCKET sS;

    try {
        if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0)
            throw SetErrorMsgText("Startup:", WSAGetLastError());

        if ((sS = socket(AF_INET, SOCK_DGRAM, 0)) == INVALID_SOCKET)
            throw SetErrorMsgText("Socket:", WSAGetLastError());

        SOCKADDR_IN serv;
        serv.sin_family = AF_INET;
        serv.sin_port = htons(2000);
        serv.sin_addr.s_addr = INADDR_ANY;

        if (bind(sS, (LPSOCKADDR)&serv, sizeof(serv)) == SOCKET_ERROR)
            throw SetErrorMsgText("Bind:", WSAGetLastError());

        cout << "Сервер запущен, ожидание сообщений от клиента...\n";

        SOCKADDR_IN clnt;
        int clntSize = sizeof(clnt);
        char buffer[50];

        while (true) {
            int bytesRecv = recvfrom(sS, buffer, sizeof(buffer), 0, (SOCKADDR*)&clnt, &clntSize);
            if (bytesRecv == SOCKET_ERROR) {
                cout << "Ошибка получения данных: " << WSAGetLastError() << endl;
                break;
            }

            buffer[bytesRecv] = '\0';
            if (string(buffer).empty()) break;

            string response = "ECHO: " + string(buffer);
            sendto(sS, response.c_str(), response.size() + 1, 0, (SOCKADDR*)&clnt, clntSize);
            cout << "Сообщение от клиента: " << buffer << "\n";
        }

        closesocket(sS);
        WSACleanup();
    }
    catch (string errMsg) {
        cout << errMsg << "\n";
    }

    return 0;
}
