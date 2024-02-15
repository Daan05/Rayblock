#include "glad/glad.h"
#include "GLFW/glfw3.h"

#include <stdio.h>

#include "application.hpp"
#include "shader.hpp" // ?

int main()
{
    Application app(1280, 720);

    // main loop
    while(app.run)
    {
        // handle input
        app.processInput();

        // set uniforms
        //setVec3(shader, "camPos", camPos.x, camPos.y, camPos.z);             // player location
        //setVec3(shader, "orientation", orientation.x, orientation.y, orientation.z);         // direction player is looking

        // draw frame
        // for now just a simple scene
        // later voxel engine with a datastructure
        app.clearScreen();
        // app. drawFrame();
        glDrawArrays(GL_TRIANGLES, 0, 6);
        // swap buffers
        app.swapBuffers();
    }

    // clean up glfw
    app.cleanup();
}
