cmake_minimum_required(VERSION 3.10)

project(dynamic_mappings_library)

add_library(mappings_def SHARED src/mappings.c)

target_include_directories(mappings_def PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/src)

set(def_file "${CMAKE_CURRENT_SOURCE_DIR}/src/mappings.def")

target_sources(mappings_def PRIVATE ${def_file})
