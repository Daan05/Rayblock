#ifndef APPLICATION_H
#define APPLICATION_H
#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include <stdio.h>

#include "shader.h"

static unsigned int windowW = 1280;
static unsigned int windowH = 720;

static char firstClick = 1;
static float sensitivity = 100;

struct Vec3 {
    float x;
    float y; 
    float z;
} camPos, orientation, newOrientation;

GLFWwindow* initGLFW(int width, int heigth);
void initGLAD();

void cleanup();

void processInput();

void clearScreen();

void framebuffer_size_callback(GLFWwindow* window, int width, int height);

#endif