#include "glad/glad.h"
#include "GLFW/glfw3.h"

#include <stdio.h>

#include "application.hpp"

int main()
{
    Application app(800, 800);

    double timePast = glfwGetTime();
    int frameCount = 0;

    // main loop
    while(app.run)
    {
        // handle input
        app.processInput();

        // update stuff
        
        // set uniforms
        app.setUniforms();

        // draw frame
        // for now just a simple scene
        // later voxel engine with a datastructure
        app.clearScreen();
        // app. drawFrame();
        glDrawArrays(GL_TRIANGLES, 0, 6);

        // swap buffers
        app.swapBuffers();

        // delta time
        double currentTime = glfwGetTime();
        app.ts = currentTime - app.lastTime;
        app.lastTime = currentTime;
        frameCount++;

        if (timePast + 1.0 < currentTime) // cout fps once per second
        {
            std::cout << frameCount << "\n";
            frameCount = 0;
            timePast = glfwGetTime();
        }
    }

    // clean up glfw
    app.cleanup();
}
