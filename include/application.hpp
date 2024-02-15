#ifndef APPLICATION_H
#define APPLICATION_H

#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include <stdio.h>

#include "shader.hpp"

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

    bool run = true;

private:

	unsigned int width;
	unsigned height;

	GLFWwindow* window;
	//Camera* camera;
	Shader* shader;
};

void framebuffer_size_callback(GLFWwindow* window, int width, int height);

#endif