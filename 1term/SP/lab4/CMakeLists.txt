cmake_minimum_required(VERSION 3.10)

# Использование компилятора Clang
set(CMAKE_C_COMPILER "clang")

# Название проекта
project(Lab03 C)

# Установка стандарта C
set(CMAKE_C_STANDARD 99)

# Добавление исходных файлов
add_executable(Lab-04 src/Lab-04.c)
add_executable(Lab-04b src/Lab-04b.c)