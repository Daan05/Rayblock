#pragma once
#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include "glm/glm.hpp"

#include <iostream>

class Application
{
public:
	Application(int w, int h)
        : width(w), height(h) {}
	~Application() = default;

	void run();

private:

    void initGLFW();
    void initGLAD();
    void mainLoop();
    void cleanup();

    void processInput();

    void clearScreen();
private:
	GLFWwindow* window;
	int width, height;
};
