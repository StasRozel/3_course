project(Lab-06a LANGUAGES C)

add_executable(Lab-06a src/Lab-06a.c)
add_executable(Lab-06b src/Lab-06b.c)
add_executable(Lab-06c src/Lab-06c.c)

target_link_libraries(Lab-06a PRIVATE Shlwapi)

