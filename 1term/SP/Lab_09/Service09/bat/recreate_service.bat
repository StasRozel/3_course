sc stop DirectoryWatcherService
sc delete DirectoryWatcherService
sc create DirectoryWatcherService binPath= "E:\Univer\3_course\SP\Lab_09\Service09\build\Debug\Lab-06c.exe"
sc start DirectoryWatcherService
sc query DirectoryWatcherService