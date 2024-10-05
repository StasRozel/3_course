#include <iostream>
#include <string>
#include "Errors.h"
#include "Winsock2.h"
#pragma comment(lib, "WS2_32.lib")
#pragma warning( disable : 4996)

#define INADDR_ANY        (u_long)0x00000000
#define INADDR_LOOPBACK    0x7f000001        
#define INADDR_BROADCAST  (u_long)0xffffffff  
#define INADDR_NONE        0xffffffff        
#define ADDR_ANY           INADDR_ANY             

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
        SOCKET sS;
        if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0)
            throw  SetErrorMsgText("Startup:", WSAGetLastError());

	    if ((sS = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET)
	        throw  SetErrorMsgText("socket: ", WSAGetLastError());

        SOCKADDR_IN serv;                
        serv.sin_family = AF_INET;            
        serv.sin_port = htons(2000);      
        serv.sin_addr.s_addr = INADDR_ANY;

        if (bind(sS, (LPSOCKADDR)&serv, sizeof(serv)) == SOCKET_ERROR)
            throw  SetErrorMsgText("bind:", WSAGetLastError());

        if (listen(sS, SOMAXCONN) == SOCKET_ERROR)
            throw  SetErrorMsgText("listen:", WSAGetLastError());

        SOCKET cS;
        SOCKADDR_IN clnt;
        memset(&clnt, 0, sizeof(clnt));
        int lclnt = sizeof(clnt);
        while (true) {
            

            if ((cS = accept(sS, (sockaddr*)&clnt, &lclnt)) == INVALID_SOCKET)
                throw  SetErrorMsgText("accept:", WSAGetLastError());

            char buffer[64];
            int bytesReceived;
            bool flag = true;
            while (flag) {
                bytesReceived = recv(cS, buffer, sizeof(buffer) - 1, 0);
                if (bytesReceived == 0) {
                    cout << "Соединение закрыто клиентом." << endl;
                    flag = false;
                    break;
                }

                buffer[bytesReceived] = '\0';
                cout << "Получено: " << buffer << endl;

                string response = string(buffer);
                int result = send(cS, response.c_str(), response.size(), 0);
                if (result == SOCKET_ERROR) {
                    throw SetErrorMsgText("send:", WSAGetLastError());
                }

                bytesReceived = recv(cS, buffer, sizeof(buffer) - 1, 0);
                if  (bytesReceived == 0) {
                    cout << "Соединение закрыто клиентом." << endl;
                    flag = false;
                    break;
                }

                cout << "Получено после сложения: " << buffer << endl;
                cout << endl;

            }
        }
        cout << "IP-address: " << inet_ntoa(clnt.sin_addr) << "\nPort: " << clnt.sin_port << endl;
       

        if (closesocket(sS) == SOCKET_ERROR)
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
