#pragma once
#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include <stdio.h>

#include "shader.hpp"
#include "camera.hpp"

static unsigned int width;
static unsigned int height;

class Application
{
public:
	Application(unsigned int wWidth, unsigned int wHeight);
	~Application();

	void initGLFW();
	void initGLAD();

	void processInput();

	void clearScreen();

    void swapBuffers();

    void cleanup();

    void setUniforms();

    bool run = true;
    Camera* camera;

    double lastTime;
    float ts;

private:

	GLFWwindow* window;
	Shader* shader;
};

void framebuffer_size_callback(GLFWwindow* window, int width, int height);
