#include <iostream>
#include <string>
#include <ws2tcpip.h>	
#include "Winsock2.h"
#include "Errors.h"
#pragma comment(lib, "WS2_32.lib")

#define INADDR_ANY        (u_long)0x00000000
#define INADDR_LOOPBACK    0x7f000001        
#define INADDR_BROADCAST  (u_long)0xffffffff  
#define INADDR_NONE        0xffffffff        
#define ADDR_ANY           INADDR_ANY      
#define _WINSOCK_DEPRECATED_NO_WARNINGS

#define s_addr  S_un.S_addr     
#define s_host  S_un.S_un_b.s_b2   
#define s_net   S_un.S_un_b.s_b1  
#define s_imp   S_un.S_un_w.s_w2  
#define s_impno S_un.S_un_b.s_b4   
#define s_lh    S_un.S_un_b.s_b3  

typedef struct sockaddr_in SOCKADDR_IN;
typedef struct sockaddr_in* PSOCKADDR_IN;
typedef struct sockaddr_in FAR* LPSOCKADDR_IN;

using namespace std;

int main()
{
	setlocale(LC_ALL, "Russian");
	WSADATA wsaData;

	try
	{

		if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0)
			throw  SetErrorMsgText("Startup:", WSAGetLastError());

		SOCKET  cC;                          // серверный сокет
		if ((cC = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET)
			throw  SetErrorMsgText("socket:", WSAGetLastError());

		SOCKADDR_IN serv;                    // параметры  сокета сервера
		serv.sin_family = AF_INET;           // используется IP-адресация  
		serv.sin_port = htons(2000);                   // TCP-порт 2000

		if (inet_pton(AF_INET, "127.0.0.1", &serv.sin_addr) <= 0)
			throw SetErrorMsgText("inet_pton:", WSAGetLastError());

		if ((connect(cC, (sockaddr*)&serv, sizeof(serv))) == SOCKET_ERROR)
			throw  SetErrorMsgText("connect:", WSAGetLastError());

		for (int i = 0; i < 1000; ++i) {
			char buffer[64];
			int bytesReceived;

            string message = "Сообщение номер: " + to_string(i + 1);
            int result = send(cC, message.c_str(), message.size(), 0);
            if (result == SOCKET_ERROR)
                throw SetErrorMsgText("send:", WSAGetLastError());

            cout << "Отправлено: " << message << endl;
            // Можно добавить задержку между сообщениями, если нужно
            // Sleep(100); // Задержка в миллисекундах

			bytesReceived = recv(cC, buffer, sizeof(buffer) - 1, 0);
			if (bytesReceived == SOCKET_ERROR) {
				throw SetErrorMsgText("recv:", WSAGetLastError());
			}
			buffer[bytesReceived] = '\0';
			cout << buffer << endl;
        }

		if (closesocket(cC) == SOCKET_ERROR)
			throw  SetErrorMsgText("closesocket:", WSAGetLastError());

		if (WSACleanup() == SOCKET_ERROR)
			throw  SetErrorMsgText("Cleanup:", WSAGetLastError());
	}
	catch (string errorMsgText)
	{
		cout << endl << "WSAGetLastError: " << errorMsgText;
	}

	return 0;
}