#include "application.hpp"

void Application::run()
{
    initGLFW();
    initGLAD();
    mainLoop();
    cleanup();
}

void Application::initGLFW()
{
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 6);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

#ifdef __APPLE__
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
#endif

    window = glfwCreateWindow(width, height, "Minecraft V1.0", nullptr, nullptr);
    if (window == NULL)
    {
        std::cout << "Failed to create GLFW window" << std::endl;
        glfwSetWindowShouldClose(window, true); // does this even work?
        glfwTerminate();
    }
    glfwMakeContextCurrent(window);
    glfwSwapInterval(0); // vsync off
}

void Application::initGLAD()
{
    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
    {
        std::cout << "Failed to initialize GLAD" << std::endl;
    }
}

void Application::mainLoop()
{
    while (!glfwWindowShouldClose(window))
    {
        // handle input
        processInput();

        // set uniforms

        // draw frame
        clearScreen();

        // swap buffers
        glfwSwapBuffers(window);
        glfwPollEvents();
    }
}

void Application::cleanup()
{
    glfwDestroyWindow(window);
    glfwTerminate();
}

void Application::processInput()
{
    if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
    {
        glfwSetWindowShouldClose(window, true);
    }

    // check other inputs
}

void Application::clearScreen()
{
    glClearColor(0.0, 0.0, 0.0, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT || GL_DEPTH_BUFFER_BIT);
}
