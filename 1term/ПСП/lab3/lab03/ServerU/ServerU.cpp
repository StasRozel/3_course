#define _WINSOCK_DEPRECATED_NO_WARNINGS

#include <iostream>
#include "Winsock2.h"
#pragma comment(lib, "WS2_32.lib")
#include "WSAErrors.h"

using namespace std;


int main() {
    WSADATA wsaData;
    SOCKET serverSocket;

    SOCKADDR_IN server;
    server.sin_family = AF_INET;
    server.sin_port = htons(2000);
    server.sin_addr.S_un.S_addr = INADDR_ANY;

    int recvBufSize = 500;

    try {
        if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0) {
            throw SetErrorMsgText("Startup: ", WSAGetLastError());
        }
        if ((serverSocket = socket(AF_INET, SOCK_DGRAM, NULL)) == INVALID_SOCKET) {
            throw SetErrorMsgText("Socket: ", WSAGetLastError());
        }
        if (setsockopt(serverSocket, SOL_SOCKET, SO_RCVBUF, (char*)&recvBufSize, sizeof(recvBufSize)) == SOCKET_ERROR) {
            throw SetErrorMsgText("SetSockOpt: ", WSAGetLastError());
        }
        if (bind(serverSocket, (LPSOCKADDR)&server, sizeof(server)) == SOCKET_ERROR) {
            throw SetErrorMsgText("Bind: ", WSAGetLastError());
        }

        cout << "[Server started]" << endl;

        while (true) {
            try {
                SOCKADDR_IN client;
                memset(&client, 0, sizeof(client));
                int lclient = sizeof(client);

                char ibuf[50], obuf[50];
                int libuf = 0, lobuf = 0;

                if ((libuf = recvfrom(serverSocket, ibuf, sizeof(ibuf), NULL, (sockaddr*)&client, &lclient)) == SOCKET_ERROR) {
                    throw SetErrorMsgText("Receive: ", WSAGetLastError());
                }

                cout << "[Client connected from " << inet_ntoa(client.sin_addr) << ":" << htons(client.sin_port) << "]" << endl;

                cout << "[Client]: " << ibuf << endl;

                Sleep(1000);

                if ((lobuf = sendto(serverSocket, ibuf, sizeof(ibuf), NULL, (sockaddr*)&client, lclient)) == SOCKET_ERROR) {
                    throw SetErrorMsgText("Send: ", WSAGetLastError());
                }

                cout << "[Client disconnected]" << endl;
            }
            catch (string errorMsgText) {
                cout << "[Error: " << errorMsgText << "]" << endl;
            }
        }

        if (closesocket(serverSocket) == INVALID_SOCKET) {
            throw SetErrorMsgText("CloseSocket: Server: ", WSAGetLastError());
        }

        cout << "[Server stoped]" << endl;

        if (WSACleanup() == SOCKET_ERROR) {
            throw SetErrorMsgText("Cleanup: ", WSAGetLastError());
        }
    }
    catch (string errorMsgText) {
        cout << "[Error: " << errorMsgText << "]" << endl;
    }
}
