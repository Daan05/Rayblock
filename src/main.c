#include "glad/glad.h"
#include "glfw/glfw3.h"

#include <stdio.h>

#include "application.h"
#include "shader.h"

unsigned int wWidth = 800;
unsigned int wHeight = 600;

void framebuffer_size_callback(GLFWwindow* window, int width, int height);

int main()
{
    // create window
    GLFWwindow* window = initGLFW(wWidth, wHeight);
    glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
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

        // set uniforms
        setVec2(shader, "screenDimensions", (float)wWidth, (float)wHeight);    // screen dimensions
        setVec3(shader, "camPos", 0.0, 6.0, -14.0);             // player location
        setVec3(shader, "orientation", 0.0, -0.5, 1.0);         // direction player is looking

        // draw frame
        // for now just a simple scene
        // later voxel engine with a datastructure
        clearScreen();
        glDrawArrays(GL_TRIANGLES, 0, 6);

        // swap buffers
        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    // clean up glfw
    cleanup();
}

void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
    wWidth = width;
    wHeight = height;
    glViewport(0, 0, wWidth, wHeight);
}
