#include "application.hpp"

Application::Application(unsigned int wWidth, unsigned int wHeight)
{
    width = wWidth;
    height = wHeight;

    initGLFW();
    initGLAD();

    // ---------------------------------- 
    unsigned int VAO;
    glGenVertexArrays(1, &VAO);
    glBindVertexArray(VAO);

    // these vertices make a rect that completely fill out screen
    float vertices[] = {
        -1.0, -1.0,
         1.0, -1.0,
         1.0,  1.0,

         1.0,  1.0,
        -1.0,  1.0,
        -1.0, -1.0
    };

    unsigned int VBO;
    glGenBuffers(1, &VBO);
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

    // layout (position = 0) in vec2 aPos;
    glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 2 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(0);
    // ---------------------------------- 

    shader = new Shader("shaders/shader.vert", "shaders/shader.frag");
    shader->use();
    camera = new Camera(45, 1, 100, shader->ID, window);

    glUniform2f(glGetUniformLocation(3, "screenDimensions"), width, height);
    
    // -----------------------
    struct Voxel
    {
        glm::uvec4 v;
    };

    glm::uvec2 data[1000];
    for (unsigned int i = 0; i < 10; i++)
    {
        for (unsigned int j = 0; j < 10; j++)
        {
            for (unsigned int k = 0; k < 10; k++)
            {
                if (j < 5 || k == 0)
                    data[i * 100 + j * 10 + k] = glm::uvec2(1, k);//, k, j, i);//, { k, j, i }};
                else 
                    data[i * 100 + j * 10 + k] = glm::uvec2(0, k);//, k, j, i);//, { k, j, i }};
            }
        }
    }

    GLuint ssbo;
    glGenBuffers(1, &ssbo);
    glBindBuffer(GL_SHADER_STORAGE_BUFFER, ssbo);
    glBufferData(GL_SHADER_STORAGE_BUFFER, sizeof(data), data, GL_STATIC_READ); //sizeof(data) only works for statically sized C/C++ arrays.
    glBindBufferBase(GL_SHADER_STORAGE_BUFFER, 1, ssbo);
    //glBindBuffer(GL_SHADER_STORAGE_BUFFER, 0); // unbind
}

Application::~Application()
{

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

    window = glfwCreateWindow(width, height, "Rayblock", NULL, NULL);
    if (window == NULL)
    {
        std::cout << "Failed to create GLFW window" << std::endl;
        glfwSetWindowShouldClose(window, true); // does this even work?
        glfwTerminate();
    }
    glfwMakeContextCurrent(window);
    glfwSwapInterval(0); // vsync off
    glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
}

void Application::initGLAD()
{
    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
    {
        std::cout << "Failed to initialize GLAD" << std::endl;
    }
}

void Application::processInput()
{
    if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
    {
        glfwSetWindowShouldClose(window, true);
        run = false;
    }
    run = !glfwWindowShouldClose(window);

    camera->OnUpdate(ts);
    camera->resize(width, height);
}

void Application::clearScreen()
{
    glClearColor(0.2, 0.2, 0.2, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);
}

void Application::swapBuffers()
{
    glfwSwapBuffers(window);
    glfwPollEvents();
}

void Application::cleanup()
{
    glfwDestroyWindow(window);
    glfwTerminate();
}

void Application::setUniforms()
{
    camera->setUniforms();
}

void framebuffer_size_callback(GLFWwindow* window, int x, int y)
{
    width = x;
    height = y;
    glUniform2f(glGetUniformLocation(3, "screenDimensions"), x, y);
    glViewport(0, 0, x, y);
}
