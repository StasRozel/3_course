cmake_minimum_required(VERSION 3.10)

project(MappingsLibrary)

add_library(mappings STATIC src/mappings.c)

target_include_directories(mappings PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/src)
set_target_properties(mappings PROPERTIES ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib/static)
