#include "application.h"

GLFWwindow* initGLFW(int width, int heigth)
{
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 6);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

#ifdef __APPLE__
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
#endif

    GLFWwindow* window = glfwCreateWindow(width, heigth, "Minecraft V1.0", NULL, NULL);
    if (window == NULL)
    {
        printf("Failed to create GLFW window");
        glfwSetWindowShouldClose(window, 1); // does this even work?
        glfwTerminate();
    }
    glfwMakeContextCurrent(window);
    glfwSwapInterval(1); // vsync off
    glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);

    camPos.x = 0.0;
    camPos.y = 1.0;
    camPos.z = -5.0;

    orientation.x = 0.0;
    orientation.y = 0.0;
    orientation.z = 1.0;

    return window;
}

void initGLAD()
{
    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
    {
        printf("Failed to initialize GLAD");
    }
}

void cleanup(GLFWwindow* window)
{
    glfwDestroyWindow(window);
    glfwTerminate();
}

void processInput(GLFWwindow* window)
{
    if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
    {
        glfwSetWindowShouldClose(window, 1);
    }
    if (glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS)
    {
        camPos.z += 0.1;
    }
    if (glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS)
    {
        camPos.z -= 0.1;
    }
    if (glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS)
    {
        camPos.x -= 0.1;
    }
    if (glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS)
    {
        camPos.x += 0.1;
    }

    // Handles mouse inputs
    if (glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_LEFT) == GLFW_PRESS)
    {
	    glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_HIDDEN);
	
        if (firstClick == 1)
	    {
		    glfwSetCursorPos(window, (windowW / 2.f), (windowH / 2.f));
		    firstClick = 0;
	    }

	    double mouseX;
	    double mouseY;
	    glfwGetCursorPos(window, &mouseX, &mouseY);

	    float rotX = sensitivity * (float)(mouseY - (windowW / 2.f)) / windowW;
	    float rotY = sensitivity * (float)(mouseX - (windowH / 2.f)) / windowH;

	    //newOrientation = glm::rotate(Orientation, glm::radians(-rotX), glm::normalize(glm::cross(Orientation, Up)));
        // use this for rotation matrix https://stackoverflow.com/questions/6721544/circular-rotation-around-an-arbitrary-axis


	    //if (abs(glm::angle(newOrientation, Up) - glm::radians(90.0f)) <= glm::radians(85.0f))
	    //{
		//    orientation = newOrientation;
	    //}

	    //orientation = glm::rotate(Orientation, glm::radians(-rotY), Up);

	    glfwSetCursorPos(window, (windowW / 2.f), (windowH / 2.f));
    }
    else if (glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_LEFT) == GLFW_RELEASE)
    {
	    glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_NORMAL);
	    firstClick = 1;
    }
}

void clearScreen()
{
    glClearColor(0.0, 0.0, 0.0, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);
}

void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
    setVec2(3, "screenDimensions", (float)width, (float)height);
    windowW = width;
    windowH = height;
    // the shader program id = 3. if there are more shaders this won't work
    glViewport(0, 0, width, height);
}

