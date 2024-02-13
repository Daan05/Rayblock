#include "glad/glad.h"
#include "glfw/glfw3.h"

#include <stdio.h>

#include "application.h"
#include "shader.h"

unsigned int wWidth = 1280;
unsigned int wHeight = 720;

int main()
{
    // create window
    GLFWwindow* window = initGLFW(wWidth, wHeight);
    initGLAD();

    // create shader
    unsigned int shader = createShaderProgram("shaders/shader.vert", "shaders/shader.frag");
    useShader(shader);

    // create vao and vbo
    unsigned int VAO = createVAO();
    unsigned int VBO = createVBO();

    // main loop
    while(!glfwWindowShouldClose(window))
    {
        // handle input
        processInput();

        // draw frame
        clearScreen();
        glDrawArrays(GL_TRIANGLES, 0, 6);

        // swap buffers
        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    // clean up glfw
    cleanup();
}
