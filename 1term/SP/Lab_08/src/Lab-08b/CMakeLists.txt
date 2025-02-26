cmake_minimum_required(VERSION 3.10)
project(Lab_08b)

set(CMAKE_C_STANDARD 11)

set(SOURCES src/Lab-08b.c)

link_directories(${CMAKE_BINARY_DIR}/src/mappingsd)
link_directories(${CMAKE_BINARY_DIR}/src/mappingsd-2)

add_executable(${PROJECT_NAME} ${SOURCES})

# Линковка с библиотеками
target_link_libraries(${PROJECT_NAME} 
    mappings_def
    mappings_dllexport
    shlwapi  # Добавляем линковку с shlwapi.lib
)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

# Копирование DLL после сборки
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
    ${CMAKE_BINARY_DIR}/src/mappingsd/mappings_def.dll
    ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/mappings_def.dll
)

add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
    ${CMAKE_BINARY_DIR}/src/mappingsd-2/mappings_dllexport.dll
    ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/mappings_dllexport.dll
)
