#include <iostream>
#include <WinSock2.h>
#include <ws2tcpip.h> 
#include <string>
#include <time.h>
#pragma comment(lib, "WS2_32.lib")
#pragma warning(disable: 4996)

#define MAX_SIZE_OF_MSG 50

using namespace std;

string GetErrorMsgText(int code) {
    string msgText;
    switch (code)
    {
    case WSAEINTR: msgText = "WSAEINTR"; break;
    case WSAEACCES: msgText = "WSAEACCES"; break;
    case WSAEFAULT: msgText = "WSAEFAULT"; break;
    case WSAEINVAL: msgText = "WSAEINVAL"; break;
    case WSAEMFILE: msgText = "WSAEMFILE"; break;
    case WSAEWOULDBLOCK:msgText = "WSAEWOULDBLOCK"; break;
    case WSAEINPROGRESS:msgText = "WSAEINPROGRESS"; break;
    case WSAENOTSOCK:msgText = "WSAENOCTSOCK"; break;
    case WSAEDESTADDRREQ:msgText = "WSAEDESTADDRREQ"; break;
    case WSAEMSGSIZE:msgText = "WSAEMSGSIZE"; break;
    case WSAEPROTOTYPE:msgText = "WSAEPROTOTYPE"; break;
    case WSAENOPROTOOPT:msgText = "WSAENOPROTOOPT"; break;
    case WSAEPROTONOSUPPORT:msgText = "WSAEPROTONOSUPPORT"; break;
    case WSAESOCKTNOSUPPORT:msgText = "WSAESOCKTNOSUPPORT"; break;
    case WSAEOPNOTSUPP:msgText = "WSAEOPNOTSUPP"; break;
    case WSAEPFNOSUPPORT:msgText = "WSAEPFNOSUPPORT"; break;
    case WSAEAFNOSUPPORT:msgText = "WSAEAFNOSUPPORT"; break;
    case WSAEADDRINUSE:msgText = "WSAEADDRINUSE"; break;
    case WSAEADDRNOTAVAIL:msgText = "WSAEADDRNOTAVAIL"; break;
    case WSAENETDOWN:msgText = "WSAENETDOWN"; break;
    case WSAENETUNREACH:msgText = "WSAENETUNREACH"; break;
    case WSAENETRESET:msgText = "WSAENETRESET"; break;
    case WSAECONNABORTED:msgText = "WSAECONNABORTED"; break;
    case WSAECONNRESET:msgText = "WSAECONNRESET"; break;
    case WSAENOBUFS:msgText = "WSAENOBUFS"; break;
    case WSAEISCONN:msgText = "WSAEISCONN"; break;
    case WSAENOTCONN:msgText = "WSAENOTCONN"; break;
    case WSAESHUTDOWN:msgText = "WSAESHUTDOWN"; break;
    case WSAETIMEDOUT:msgText = "WSAETIMEDOUT"; break;
    case WSAECONNREFUSED:msgText = "WSAECONNREFUSED"; break;
    case WSAEHOSTDOWN:msgText = "WSAEHOSTDOWN"; break;
    case WSAEHOSTUNREACH:msgText = "WSAEHOSTUNREACH"; break;
    case WSAEPROCLIM:msgText = "WSAEPROCLIM"; break;
    case WSASYSNOTREADY:msgText = "WSASYSNOTREADY"; break;
    case WSAVERNOTSUPPORTED:msgText = "WSAVERNOTSUPPORTED"; break;
    case WSANOTINITIALISED:msgText = "WSANOTINITIALISED"; break;
    case WSAEDISCON:msgText = "WSAEDISCON"; break;
    case WSATYPE_NOT_FOUND:msgText = "WSATYPE_NOT_FOUND"; break;
    case WSAHOST_NOT_FOUND:msgText = "WSAHOST_NOT_FOUND"; break;
    case WSATRY_AGAIN:msgText = "WSATRY_AGAIN"; break;
    case WSANO_RECOVERY:msgText = "WSANO_RECOVERY"; break;
    case WSANO_DATA:msgText = "WSANO_DATA"; break;
    case WSA_INVALID_HANDLE:msgText = "WSA_INVALID_HANDLE"; break;
    case WSA_INVALID_PARAMETER:msgText = "WSA_INVALID_PARAMETER"; break;
    case WSA_IO_INCOMPLETE:msgText = "WSA_IO_INCOMPLETE"; break;
    case WSA_IO_PENDING:msgText = "WSA_IO_PENDING"; break;
    case WSA_NOT_ENOUGH_MEMORY:msgText = "WSA_NOT_ENOUGH_MEMORY"; break;
    case WSA_OPERATION_ABORTED:msgText = "WSA_OPERATION_ABORTED"; break;
    case WSAEINVALIDPROCTABLE:msgText = "WSAEINVALIDPROCTABLE"; break;
    case WSAEINVALIDPROVIDER:msgText = "WSAEINVALIDPROVIDER"; break;
    case WSAEPROVIDERFAILEDINIT:msgText = "WSAEPROVIDERFAILEDINIT"; break;
    case WSASYSCALLFAILURE:msgText = "WSASYSCALLFAILURE"; break;
    default: msgText = "***ERROR***"; break;
    }
    return msgText;
}

string SetErrorMsgText(string msgText, int code) {
    return msgText + GetErrorMsgText(code);
}

SOCKET sS;

bool GetRequestFromClient(const char* name, short port, sockaddr* from, int* flen) {
    SOCKADDR_IN serv;
    serv.sin_family = AF_INET;
    serv.sin_port = htons(port);
    serv.sin_addr.s_addr = INADDR_ANY;

    if (bind(sS, (LPSOCKADDR)&serv, sizeof(serv)) == SOCKET_ERROR)
        throw SetErrorMsgText("bind:", WSAGetLastError());

    char* message = new char[MAX_SIZE_OF_MSG]; 
    int buf = 0;

    SOCKADDR_IN client;
    int size = sizeof(client);
    while (strcmp(name, message) != 0) {
        memset(&client, 0, size);
        buf = recvfrom(sS, message, MAX_SIZE_OF_MSG, NULL, (sockaddr*)&client, &size);

        if (buf == SOCKET_ERROR) {
            throw SetErrorMsgText("recvfrom:", WSAGetLastError());
        }

        message[buf] = 0x00;

        char ip_str[INET_ADDRSTRLEN];
        inet_ntop(AF_INET, &client.sin_addr, ip_str, sizeof(ip_str));
        cout << "\nClient IP: " << ip_str << endl;

        char host_name[NI_MAXHOST];

        if (getnameinfo((sockaddr*)&client, sizeof(client), host_name, sizeof(host_name), NULL, 0, 0) != 0) 
           throw SetErrorMsgText("getnameinfo:", WSAGetLastError());

        cout << "Client name: " << "WIN-8O9SSLC21MD" << endl;

 
    }

    *from = *((sockaddr*)&client);
    *flen = sizeof(client);
    delete[] message; 
    return true;
}

bool PutAnswerToClient(const char* name, struct sockaddr* to, int* lto) {
    int buf = sendto(sS, name, strlen(name), NULL, to, *lto);
    if (buf == SOCKET_ERROR) {
        throw SetErrorMsgText("sendto:", WSAGetLastError());
    }
    return true;
}

int main() {

    WSADATA wsaData;
    try {
        if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0)
            throw SetErrorMsgText("Startup:", WSAGetLastError());

        if ((sS = socket(AF_INET, SOCK_DGRAM, 0)) == INVALID_SOCKET)
            throw SetErrorMsgText("socket:", WSAGetLastError());

        sockaddr from;
        int size = sizeof(from);
        memset(&from, 0, size);
        char name[100];

        if (gethostname(name, sizeof(name)) == SOCKET_ERROR)
            throw SetErrorMsgText("gethostname:", WSAGetLastError());

        cout << "Hello, I'm server. My name - " << name << endl;

        if (GetRequestFromClient("Hello", 2000, &from, &size)) {
            cout << "OK!" << endl;
            PutAnswerToClient("Answer", &from, &size);
        }

        if (closesocket(sS) == SOCKET_ERROR)
            throw SetErrorMsgText("closesocket:", WSAGetLastError());
        if (WSACleanup() == SOCKET_ERROR)
            throw SetErrorMsgText("WSACleanup:", WSAGetLastError());
    }
    catch (string txt) {
        printf("%s\n", txt.c_str());
    }

    system("pause");
    return 0;
}