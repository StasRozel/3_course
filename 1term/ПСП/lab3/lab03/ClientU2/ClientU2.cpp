#define _WINSOCK_DEPRECATED_NO_WARNINGS
#define _CRT_SECURE_NO_WARNINGS

#include <iostream>
#include "Winsock2.h"
#pragma comment(lib, "WS2_32.lib")
#include "WSAErrors.h"

using namespace std;


int main() {
    WSADATA wsaData;

    SOCKET clientSocket;

    SOCKADDR_IN server;
    int lserver = sizeof(server);
    server.sin_family = AF_INET;
    server.sin_port = htons(2000);
    server.sin_addr.S_un.S_addr = inet_addr("127.0.0.1");

    int timeout = 10000;

    try {
        if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0) {
            throw SetErrorMsgText("Startup: ", WSAGetLastError());
        }
        if ((clientSocket = socket(AF_INET, SOCK_DGRAM, NULL)) == INVALID_SOCKET) {
            throw SetErrorMsgText("Socket: ", WSAGetLastError());
        }
        if (setsockopt(clientSocket, SOL_SOCKET, SO_RCVTIMEO, (char*)&timeout, sizeof(timeout)) < 0) {
            throw SetErrorMsgText("SetSockOpt: ", WSAGetLastError());
        }

        int n = 1;
        int received = 0;
        clock_t start, stop;
        double duration;

        cout << "Enter number of messages: "; cin >> n;

        start = clock();
        for (int i = 1; i <= n; i++) {
            char obuf[50];
            int lobuf = 0;

            sprintf(obuf, "Hello from Client %d", i);

            if ((lobuf = sendto(clientSocket, obuf, sizeof(obuf), NULL, (sockaddr*)&server, lserver)) == SOCKET_ERROR) {
                throw SetErrorMsgText("Send: ", WSAGetLastError());
            }

            cout << "[Sended]: " << obuf << endl;

            Sleep(100);
        }
        while (true) {
            char ibuf[50];
            int libuf = 0;

            if ((libuf = recvfrom(clientSocket, ibuf, sizeof(ibuf), NULL, (sockaddr*)&server, &lserver)) == SOCKET_ERROR) {
                if (WSAGetLastError() == WSAETIMEDOUT) {
                    break;
                }
                else {
                    throw SetErrorMsgText("Receive: ", WSAGetLastError());
                }
            }

            received++;

            cout << "[Received]: " << ibuf << endl;
        }
        stop = clock();

        duration = (double)(stop - start) / CLOCKS_PER_SEC;

        cout << "[Time: " << duration << "s]" << endl;
        cout << "[Received " << received << " from " << n << " messages]" << endl;

        if (closesocket(clientSocket) == INVALID_SOCKET) {
            throw SetErrorMsgText("CloseSocket: ", WSAGetLastError());
        }
        if (WSACleanup() == SOCKET_ERROR) {
            throw SetErrorMsgText("Cleanup: ", WSAGetLastError());
        }
    }
    catch (string errorMsgText) {
        cout << endl << "Error: " << errorMsgText << endl;
    }
}
