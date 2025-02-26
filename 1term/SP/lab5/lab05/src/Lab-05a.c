#include <stdio.h>

void example_function() {
    printf("example function\n");
}

int global_init = 10;
int global_uninit;

static int global_static_init = 14;
static int global_static_uninit;

int main(int argc, char* argv[]) {
    int local_init = 7;
    int local_uninit;

    static int static_local_init = 21;
    static int static_local_uninit;

    printf("=== Global Variables ===\n");
    printf("Address of global_init: %p\n", (void*)&global_init);
    printf("Address of global_uninit: %p\n", (void*)&global_uninit);

    printf("Address of static_global_init: %p\n", (void*)&global_static_init);
    printf("Address of static_global_uninit: %p\n", (void*)&global_static_uninit);

    printf("\n=== Local Variables ===\n");
    printf("Address of local_init: %p\n", (void*)&local_init);
    printf("Address of local_uninit: %p\n", (void*)&local_uninit);

    printf("Address of static_local_init: %p\n", (void*)&static_local_init);
    printf("Address of static_local_uninit: %p\n", (void*)&static_local_uninit);

    printf("\n=== Function Address ===\n");
    printf("Address of example_function: %p\n", (void*)&example_function);

    printf("\n=== Command Line Arguments ===\n");
    printf("Address of argc: %p\n", (void*)&argc);
    printf("Address of argv: %p\n", (void*)&argv);

    printf("\nPress any key to continue...");
    getchar();

    return 0;
}
