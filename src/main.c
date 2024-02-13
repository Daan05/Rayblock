#include "application.h"

#include <stdio.h>

unsigned int wWidth = 1280;
unsigned int wHeight = 720;

int main()
{
    // create window
    GLFWwindow* window = initGLFW(wWidth, wHeight);
    initGLAD();

    // main loop
    while(!glfwWindowShouldClose(window))
    {
        // handle input
        processInput();

        // draw frame
        clearScreen();
        // draw()

        // swap buffers
        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    // clean up glfw
    cleanup();
}
