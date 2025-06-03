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
    SOCKET sS, sC;

    try {
        if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0)
            throw SetErrorMsgText("Startup:", WSAGetLastError());

        if ((sS = socket(AF_INET, SOCK_STREAM, 0)) == INVALID_SOCKET)
            throw SetErrorMsgText("Socket:", WSAGetLastError());

        SOCKADDR_IN serv;
        serv.sin_family = AF_INET;
        serv.sin_port = htons(2000);
        serv.sin_addr.s_addr = INADDR_ANY;

        if (bind(sS, (LPSOCKADDR)&serv, sizeof(serv)) == SOCKET_ERROR)
            throw SetErrorMsgText("Bind:", WSAGetLastError());

        if (listen(sS, SOMAXCONN) == SOCKET_ERROR)
            throw SetErrorMsgText("Listen:", WSAGetLastError());

        cout << "Сервер запущен, ожидание подключения клиента...\n";

        SOCKADDR_IN clnt;
        int clntSize = sizeof(clnt);
        if ((sC = accept(sS, (LPSOCKADDR)&clnt, &clntSize)) == INVALID_SOCKET)
            throw SetErrorMsgText("Accept:", WSAGetLastError());

        char buffer[50];
        int bytesRecv;

        while (true) {
            bytesRecv = recv(sC, buffer, sizeof(buffer), 0);
            if (bytesRecv == SOCKET_ERROR) break;
            buffer[bytesRecv] = '\0';

            if (string(buffer).empty()) break;

            string response = "ECHO: " + string(buffer);
            send(sC, response.c_str(), response.size() + 1, 0);
            cout << "Сообщение от клиента: " << buffer << "\n";
        }

        closesocket(sC);
        closesocket(sS);
        WSACleanup();
    }
    catch (string errMsg) {
        cout << errMsg << "\n";
    }

    return 0;
}
