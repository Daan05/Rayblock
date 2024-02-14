#include "glad/glad.h"
#include "GLFW/glfw3.h"

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
    unsigned int shader = createShaderProgram("shaders/shader.vert", "shaders/shader.frag"); // shader = 3
    useShader(shader);
    setVec2(shader, "screenDimensions", wWidth, (float)wHeight);

    // create vao and vbo
    unsigned int VAO = createVAO();
    unsigned int VBO = createVBO();

    // main loop
    while(!glfwWindowShouldClose(window))
    {
        // handle input
        processInput();

        // set uniforms
        setVec3(shader, "camPos", camPos.x, camPos.y, camPos.z);             // player location
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
