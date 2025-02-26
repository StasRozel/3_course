cmake_minimum_required(VERSION 3.10)

project(dynamic_mappings_dllexport)

add_library(mappings_dllexport SHARED src/mappings.c)

target_include_directories(mappings_dllexport PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/src)

set(def_file "${CMAKE_CURRENT_SOURCE_DIR}/src/mappings.def")

target_sources(mappings_dllexport PRIVATE ${def_file})
