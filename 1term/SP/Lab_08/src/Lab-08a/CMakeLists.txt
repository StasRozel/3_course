cmake_minimum_required(VERSION 3.10)

project(Lab08a)

add_executable(Lab08a src/Lab-08a.c)

target_link_libraries(Lab08a PRIVATE mappings)

target_include_directories(Lab08a PRIVATE ${CMAKE_SOURCE_DIR}/mappings/src)
