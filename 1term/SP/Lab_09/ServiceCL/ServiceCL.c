#include <windows.h>
#include <stdio.h>

void PrintUsage() {
    printf("Usage: ServiceCtl <ServiceName> <Operation> [Parameters]\n");
    printf("Operations:\n");
    printf("  Create <path_to_executable>\n");
    printf("  Start <path_to_watch> <path_to_log>\n");
    printf("  Stop\n");
    printf("  Delete\n");
    printf("  Pause\n");
    printf("  Continue\n");
    printf("  Info\n");
}

void CreateMyService(const char* serviceName, const char* executablePath) {
    SC_HANDLE scm = OpenSCManager(NULL, NULL, SC_MANAGER_CREATE_SERVICE);
    if (!scm) {
        printf("Error: OpenSCManager failed (%d)\n", GetLastError());
        return;
    }

    SC_HANDLE service = CreateServiceA(
        scm,
        serviceName,
        serviceName,
        SERVICE_ALL_ACCESS,
        SERVICE_WIN32_OWN_PROCESS,
        SERVICE_DEMAND_START,
        SERVICE_ERROR_NORMAL,
        executablePath,
        NULL, NULL, NULL, NULL, NULL
    );

    if (!service) {
        printf("Error: CreateService failed (%d)\n", GetLastError());
    } else {
        printf("Service created successfully\n");
        CloseServiceHandle(service);
    }

    CloseServiceHandle(scm);
}

void StartServiceCommand(const char* serviceName, const char* watchPath, const char* logPath) {
    SC_HANDLE scm = OpenSCManager(NULL, NULL, SC_MANAGER_CONNECT);
    if (!scm) {
        printf("Error: OpenSCManager failed (%d)\n", GetLastError());
        return;
    }

    SC_HANDLE service = OpenService(scm, serviceName, SERVICE_START);
    if (!service) {
        printf("Error: OpenService failed (%d)\n", GetLastError());
        CloseServiceHandle(scm);
        return;
    }

    const char* args[] = { watchPath, logPath };
    if (!StartService(service, 2, args)) {
        printf("Error: StartService failed (%d)\n", GetLastError());
    } else {
        printf("Service started successfully\n");
    }

    CloseServiceHandle(service);
    CloseServiceHandle(scm);
}

void StopService(const char* serviceName) {
    SC_HANDLE scm = OpenSCManager(NULL, NULL, SC_MANAGER_CONNECT);
    if (!scm) {
        printf("Error: OpenSCManager failed (%d)\n", GetLastError());
        return;
    }

    SC_HANDLE service = OpenService(scm, serviceName, SERVICE_STOP);
    if (!service) {
        printf("Error: OpenService failed (%d)\n", GetLastError());
        CloseServiceHandle(scm);
        return;
    }

    SERVICE_STATUS status;
    if (!ControlService(service, SERVICE_CONTROL_STOP, &status)) {
        printf("Error: ControlService failed (%d)\n", GetLastError());
    } else {
        printf("Service stopped successfully\n");
    }

    CloseServiceHandle(service);
    CloseServiceHandle(scm);
}

void DeleteMyService(const char* serviceName) {
    SC_HANDLE scm = OpenSCManager(NULL, NULL, SC_MANAGER_CONNECT);
    if (!scm) {
        printf("Error: OpenSCManager failed (%d)\n", GetLastError());
        return;
    }

    SC_HANDLE service = OpenService(scm, serviceName, DELETE);
    if (!service) {
        printf("Error: OpenService failed (%d)\n", GetLastError());
        CloseServiceHandle(scm);
        return;
    }

    if (!DeleteService(service)) {
        printf("Error: DeleteService failed (%d)\n", GetLastError());
    } else {
        printf("Service deleted successfully\n");
    }

    CloseServiceHandle(service);
    CloseServiceHandle(scm);
}

void PauseService(const char* serviceName) {
    SC_HANDLE scm = OpenSCManager(NULL, NULL, SC_MANAGER_CONNECT);
    if (!scm) {
        printf("Error: OpenSCManager failed (%d)\n", GetLastError());
        return;
    }

    SC_HANDLE service = OpenService(scm, serviceName, SERVICE_PAUSE_CONTINUE);
    if (!service) {
        printf("Error: OpenService failed (%d)\n", GetLastError());
        CloseServiceHandle(scm);
        return;
    }

    SERVICE_STATUS status;
    if (!ControlService(service, SERVICE_CONTROL_PAUSE, &status)) {
        printf("Error: ControlService failed (%d)\n", GetLastError());
    } else {
        printf("Service paused successfully\n");
    }

    CloseServiceHandle(service);
    CloseServiceHandle(scm);
}

void ContinueService(const char* serviceName) {
    SC_HANDLE scm = OpenSCManager(NULL, NULL, SC_MANAGER_CONNECT);
    if (!scm) {
        printf("Error: OpenSCManager failed (%d)\n", GetLastError());
        return;
    }

    SC_HANDLE service = OpenService(scm, serviceName, SERVICE_PAUSE_CONTINUE);
    if (!service) {
        printf("Error: OpenService failed (%d)\n", GetLastError());
        CloseServiceHandle(scm);
        return;
    }

    SERVICE_STATUS status;
    if (!ControlService(service, SERVICE_CONTROL_CONTINUE, &status)) {
        printf("Error: ControlService failed (%d)\n", GetLastError());
    } else {
        printf("Service continued successfully\n");
    }

    CloseServiceHandle(service);
    CloseServiceHandle(scm);
}

void QueryServiceInfo(const char* serviceName) {
    SC_HANDLE scm = OpenSCManager(NULL, NULL, SC_MANAGER_CONNECT);
    if (!scm) {
        printf("Error: OpenSCManager failed (%d)\n", GetLastError());
        return;
    }

    SC_HANDLE service = OpenService(scm, serviceName, SERVICE_QUERY_STATUS);
    if (!service) {
        printf("Error: OpenService failed (%d)\n", GetLastError());
        CloseServiceHandle(scm);
        return;
    }

    SERVICE_STATUS_PROCESS status;
    DWORD bytesNeeded;
    if (!QueryServiceStatusEx(service, SC_STATUS_PROCESS_INFO, (LPBYTE)&status, sizeof(status), &bytesNeeded)) {
        printf("Error: QueryServiceStatusEx failed (%d)\n", GetLastError());
    } else {
        printf("Service status: %d\n", status.dwCurrentState);
    }

    CloseServiceHandle(service);
    CloseServiceHandle(scm);
}

int main(int argc, char* argv[]) {
    if (argc < 3) {
        PrintUsage();
        return 1;
    }

    const char* serviceName = argv[1];
    const char* operation = argv[2];

    if (strcmp(operation, "Create") == 0 && argc >= 4) {
        CreateMyService(serviceName, argv[3]);
    } else if (strcmp(operation, "Start") == 0 && argc >= 5) {
        StartServiceCommand(serviceName, argv[4], argv[3]);
    } else if (strcmp(operation, "Stop") == 0) {
        StopService(serviceName);
    } else if (strcmp(operation, "Delete") == 0) {
        DeleteMyService(serviceName);
    } else if (strcmp(operation, "Pause") == 0) {
        PauseService(serviceName);
    } else if (strcmp(operation, "Continue") == 0) {
        ContinueService(serviceName);
    } else if (strcmp(operation, "Info") == 0) {
        QueryServiceInfo(serviceName);
    } else {
        PrintUsage();
        return 1;
    }

    return 0;
}
