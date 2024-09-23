cmake_minimum_required(VERSION 3.10)

# Установка имени проекта и версии
project(MyProject VERSION 1.0)

# Добавление исполняемого файла
add_executable(MyExecutable lab1.c)

set(CMAKE_C_COMPILER "clang")