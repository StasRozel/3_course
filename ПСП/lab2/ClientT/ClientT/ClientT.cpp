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
		int count = 0;
		cout << "Введите кол-во сообщений: " << endl;
		cin >> count;
		if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0)
			throw  SetErrorMsgText("Startup:", WSAGetLastError());

		SOCKET  cC;                          // серверный сокет
		if ((cC = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET)
			throw  SetErrorMsgText("socket:", WSAGetLastError());

		SOCKADDR_IN serv;                    // параметры  сокета сервера
		serv.sin_family = AF_INET;           // используется IP-адресация  
		serv.sin_port = htons(2000);                   // TCP-порт 2000

		if (inet_pton(AF_INET, "192.168.107.38", &serv.sin_addr) <= 0)
			throw SetErrorMsgText("inet_pton:", WSAGetLastError());

		if ((connect(cC, (sockaddr*)&serv, sizeof(serv))) == SOCKET_ERROR)
			throw  SetErrorMsgText("connect:", WSAGetLastError());
		clock_t time_req;

		time_req = clock();
		for (int i = 0; i < count; ++i) {
			char buffer[64];
			int bytesReceived;

			string message = "Hello from Client  ";

			if (i < 10) {
				message += "00";
			}
			else if (i < 100 && i >= 10) {
				message += "0";
			}

			message += to_string(i + 1);

			int result1 = send(cC, message.c_str(), message.size(), 0);
			if (result1 == SOCKET_ERROR)
				throw SetErrorMsgText("send:", WSAGetLastError());

			cout << "Отправлено на сервер: " << message << endl;

			bytesReceived = recv(cC, buffer, sizeof(buffer) - 1, 0);
			if (bytesReceived == SOCKET_ERROR) {
				throw SetErrorMsgText("recv:", WSAGetLastError());
			}
			buffer[bytesReceived] = '\0';

			cout << "Ответ от сервера: " << buffer << endl;

			string msg = buffer;
			std::string clientNumberStr = msg.substr(19, 22);

			int clientNumber = stoi(clientNumberStr);
			int size = clientNumber == 1000 ? 4 : 3;
			msg.replace(19, size, to_string(++clientNumber));

			int result2 = send(cC, msg.c_str(), msg.size(), 0);
			if (result2 == SOCKET_ERROR)
				throw SetErrorMsgText("send:", WSAGetLastError());

			cout << "Отправлено измененное: " << msg << endl;
			cout << endl;
		}

		if (closesocket(cC) == SOCKET_ERROR)
			throw  SetErrorMsgText("closesocket:", WSAGetLastError());

		if (WSACleanup() == SOCKET_ERROR)
			throw  SetErrorMsgText("Cleanup:", WSAGetLastError());

		time_req = clock() - time_req;
		cout << "Передача "<< count << " сообщений прошла за " << (float)time_req / CLOCKS_PER_SEC << " seconds" << endl;
	}

	catch (string errorMsgText)
	{
		cout << endl << "WSAGetLastError: " << errorMsgText;
	}

	return 0;
}