#ifndef APPLICATION_H
#define APPLICATION_H

#include <glad/glad.h>
#include <GLFW/glfw3.h>

//#include "glm/glm.hpp"

#include <stdio.h>

GLFWwindow* initGLFW(int width, int heigth);
void initGLAD();

void cleanup();

void processInput();

void clearScreen();

#endif