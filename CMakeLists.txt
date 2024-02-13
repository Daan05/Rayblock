cmake_minimum_required(VERSION 3.24)

project(Rayblock VERSION 1.0)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

file(GLOB_RECURSE SOURCE_FILES CONFIGURE_DEPENDS "${CMAKE_CURRENT_SOURCE_DIR}/src/*.cpp")
add_executable(${PROJECT_NAME} ${SOURCE_FILES})

target_include_directories(${PROJECT_NAME} PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/include/")
target_include_directories(${PROJECT_NAME} PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/external/") # glm is only headers. easy!
target_include_directories(${PROJECT_NAME} PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/external/glad/include")
target_include_directories(${PROJECT_NAME} PUBLIC "C:/VulkanSDK/1.3.268.0/Include/vulkan/")

# OpenGL/GLAD
add_subdirectory("${CMAKE_CURRENT_SOURCE_DIR}/external/glad")
target_link_libraries(${PROJECT_NAME} glad)

# GLFW
set(GLFW_BUILD_DOCS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)

add_subdirectory("${CMAKE_CURRENT_SOURCE_DIR}/external/glfw/")
target_link_libraries(${PROJECT_NAME} glfw)


# include more?
# https://github.com/meemknight/openglConfiguration/tree/master/
# example
