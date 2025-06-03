#define _WINSOCK_DEPRECATED_NO_WARNINGS
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
    SOCKET sC;

    try {
        if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0)
            throw SetErrorMsgText("Startup:", WSAGetLastError());

        if ((sC = socket(AF_INET, SOCK_DGRAM, 0)) == INVALID_SOCKET)
            throw SetErrorMsgText("Socket:", WSAGetLastError());

        SOCKADDR_IN serv;
        serv.sin_family = AF_INET;
        serv.sin_port = htons(2000);
        serv.sin_addr.s_addr = inet_addr("127.0.0.1");

        const string message = "Hello, UDP server!";
        sendto(sC, message.c_str(), message.size() + 1, 0, (SOCKADDR*)&serv, sizeof(serv));
        cout << "Сообщение отправлено на сервер: " << message << endl;

        char buffer[50];
        int servSize = sizeof(serv);
        int bytesRecv = recvfrom(sC, buffer, sizeof(buffer), 0, (SOCKADDR*)&serv, &servSize);
        if (bytesRecv == SOCKET_ERROR) {
            cout << "Ошибка получения данных: " << WSAGetLastError() << endl;
        }
        else {
            buffer[bytesRecv] = '\0';
            cout << "Ответ от сервера: " << buffer << "\n";
        }

        closesocket(sC);
        WSACleanup();
    }
    catch (string errMsg) {
        cout << errMsg << "\n";
    }

    return 0;
}
