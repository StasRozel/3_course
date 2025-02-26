#include <string>
#include "WinSock2.h"


#ifndef WSAINVALIDPROCTABLE
#define WSAINVALIDPROCTABLE 10104
#endif

#ifndef WSAINVALIDPROVIDER
#define WSAINVALIDPROVIDER 10105
#endif

#ifndef WSAPROVIDERFAILEDINIT
#define WSAPROVIDERFAILEDINIT 10106
#endif


std::string GetErrorMsgText(int code) {
    switch (code) {
    case WSAEINTR:
        return "WSAEINTR: Operation interrupted";
    case WSAEACCES:
        return "WSAEACCES: Permission denied";
    case WSAEFAULT:
        return "WSAEFAULT: Bad address";
    case WSAEINVAL:
        return "WSAEINVAL: Invalid argument";
    case WSAEMFILE:
        return "WSAEMFILE: Too many open files";
    case WSAEWOULDBLOCK:
        return "WSAEWOULDBLOCK: Resource temporarily unavailable";
    case WSAEINPROGRESS:
        return "WSAEINPROGRESS: Operation in progress";
    case WSAEALREADY:
        return "WSAEALREADY: Operation already in progress";
    case WSAENOTSOCK:
        return "WSAENOTSOCK: Socket operation on non-socket";
    case WSAEDESTADDRREQ:
        return "WSAEDESTADDRREQ: Destination address required";
    case WSAEMSGSIZE:
        return "WSAEMSGSIZE: Message too long";
    case WSAEPROTOTYPE:
        return "WSAEPROTOTYPE: Protocol wrong type for socket";
    case WSAENOPROTOOPT:
        return "WSAENOPROTOOPT: Bad protocol option";
    case WSAEPROTONOSUPPORT:
        return "WSAEPROTONOSUPPORT: Protocol not supported";
    case WSAESOCKTNOSUPPORT:
        return "WSAESOCKTNOSUPPORT: Socket type not supported";
    case WSAEOPNOTSUPP:
        return "WSAEOPNOTSUPP: Operation not supported";
    case WSAEPFNOSUPPORT:
        return "WSAEPFNOSUPPORT: Protocol family not supported";
    case WSAEAFNOSUPPORT:
        return "WSAEAFNOSUPPORT: Address family not supported by protocol";
    case WSAEADDRINUSE:
        return "WSAEADDRINUSE: Address already in use";
    case WSAEADDRNOTAVAIL:
        return "WSAEADDRNOTAVAIL: Cannot assign requested address";
    case WSAENETDOWN:
        return "WSAENETDOWN: Network is down";
    case WSAENETUNREACH:
        return "WSAENETUNREACH: Network is unreachable";
    case WSAENETRESET:
        return "WSAENETRESET: Network dropped connection on reset";
    case WSAECONNABORTED:
        return "WSAECONNABORTED: Software caused connection abort";
    case WSAECONNRESET:
        return "WSAECONNRESET: Connection reset by peer";
    case WSAENOBUFS:
        return "WSAENOBUFS: No buffer space available";
    case WSAEISCONN:
        return "WSAEISCONN: Socket is already connected";
    case WSAENOTCONN:
        return "WSAENOTCONN: Socket is not connected";
    case WSAESHUTDOWN:
        return "WSAESHUTDOWN: Cannot send after socket shutdown";
    case WSAETIMEDOUT:
        return "WSAETIMEDOUT: Connection timed out";
    case WSAECONNREFUSED:
        return "WSAECONNREFUSED: Connection refused";
    case WSAEHOSTDOWN:
        return "WSAEHOSTDOWN: Host is down";
    case WSAEHOSTUNREACH:
        return "WSAEHOSTUNREACH: No route to host";
    case WSAEPROCLIM:
        return "WSAEPROCLIM: Too many processes";
    case WSASYSNOTREADY:
        return "WSASYSNOTREADY: Network subsystem is unavailable";
    case WSAVERNOTSUPPORTED:
        return "WSAVERNOTSUPPORTED: Winsock.dll version out of range";
    case WSANOTINITIALISED:
        return "WSANOTINITIALISED: Successful WSAStartup not yet performed";
    case WSAEDISCON:
        return "WSAEDISCON: Graceful shutdown in progress";
    case WSATYPE_NOT_FOUND:
        return "WSATYPE_NOT_FOUND: Class type not found";
    case WSAHOST_NOT_FOUND:
        return "WSAHOST_NOT_FOUND: Host not found";
    case WSATRY_AGAIN:
        return "WSATRY_AGAIN: Non-authoritative host not found";
    case WSANO_RECOVERY:
        return "WSANO_RECOVERY: This is a non-recoverable error";
    case WSANO_DATA:
        return "WSANO_DATA: Valid name, no data record of requested type";
    case WSA_INVALID_HANDLE:
        return "WSA_INVALID_HANDLE: Specified event object handle is invalid";
    case WSA_INVALID_PARAMETER:
        return "WSA_INVALID_PARAMETER: One or more parameters are invalid";
    case WSA_IO_INCOMPLETE:
        return "WSA_IO_INCOMPLETE: Overlapped I/O event object not in signaled state";
    case WSA_IO_PENDING:
        return "WSA_IO_PENDING: Overlapped operations will complete later";
    case WSA_NOT_ENOUGH_MEMORY:
        return "WSA_NOT_ENOUGH_MEMORY: Insufficient memory available";
    case WSA_OPERATION_ABORTED:
        return "WSA_OPERATION_ABORTED: Overlapped operation aborted";
    case WSAINVALIDPROCTABLE:
        return "WSAINVALIDPROCTABLE: Invalid procedure table from service provider";
    case WSAINVALIDPROVIDER:
        return "WSAINVALIDPROVIDER: Invalid service provider version number";
    case WSAPROVIDERFAILEDINIT:
        return "WSAPROVIDERFAILEDINIT: Unable to initialize a service provider";
    case WSASYSCALLFAILURE:
        return "WSASYSCALLFAILURE: System call failure";
    default:
        return "Unknown error code";
    }
}


std::string SetErrorMsgText(std::string msgText, int code) {
    return msgText + GetErrorMsgText(code);
}
