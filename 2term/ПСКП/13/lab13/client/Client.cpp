#define _WINSOCK_DEPRECATED_NO_WARNINGS
#include "Winsock2.h"
#pragma comment(lib, "WS2_32.lib") 
#include <iostream>
#include <string>
#include <tchar.h>

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

        if ((sC = socket(AF_INET, SOCK_STREAM, 0)) == INVALID_SOCKET)
            throw SetErrorMsgText("Socket:", WSAGetLastError());

        SOCKADDR_IN serv;
        serv.sin_family = AF_INET;
        serv.sin_port = htons(2000);
        serv.sin_addr.s_addr = inet_addr("127.0.0.1");

        if (connect(sC, (SOCKADDR*)&serv, sizeof(serv)) == SOCKET_ERROR)
            throw SetErrorMsgText("Connect:", WSAGetLastError());

        const string message = "Hello, server!";
        send(sC, message.c_str(), message.size() + 1, 0);

        char buffer[50];
        recv(sC, buffer, sizeof(buffer), 0);
        cout << "Ответ от сервера: " << buffer << "\n";

        closesocket(sC);
        WSACleanup();
    }
    catch (string errMsg) {
        cout << errMsg << "\n";
    }

    return 0;
}
