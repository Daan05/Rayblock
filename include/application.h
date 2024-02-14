#ifndef APPLICATION_H
#define APPLICATION_H
#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include <stdio.h>

#include "shader.h"

GLFWwindow* initGLFW(int width, int heigth);
void initGLAD();

void cleanup();

void processInput();

void clearScreen();

void framebuffer_size_callback(GLFWwindow* window, int width, int height);

#endif