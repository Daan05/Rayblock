#include "shader.h"

unsigned int createShaderProgram(const char* vertexShaderPath, const char* fragmentShaderPath)
{
    // read vertex shader code
    char* vShaderCode;
    FILE *fp1 = fopen(vertexShaderPath, "r");
    if (fp1 != NULL) {
        /* Go to the end of the file. */
        if (fseek(fp1, 0L, SEEK_END) == 0) {
            /* Get the size of the file. */
            long bufsize = ftell(fp1);
            if (bufsize == -1) { /* Error */ }

            /* Allocate our buffer to that size. */
            vShaderCode = malloc(sizeof(char) * (bufsize + 1));

            /* Go back to the start of the file. */
            if (fseek(fp1, 0L, SEEK_SET) != 0) { /* Error */ }

            /* Read the entire file into memory. */
            size_t newLen = fread(vShaderCode, sizeof(char), bufsize, fp1);
            if ( ferror( fp1 ) != 0 ) {
                fputs("Error reading file", stderr);
            } else {
                vShaderCode[newLen++] = '\0'; /* Just to be safe. */
            }
        }
        fclose(fp1);
    }

    // read fragment shader code
    char* fShaderCode;
    FILE *fp2 = fopen(fragmentShaderPath, "r");
    if (fp2 != NULL) {
        /* Go to the end of the file. */
        if (fseek(fp2, 0L, SEEK_END) == 0) {
            /* Get the size of the file. */
            long bufsize = ftell(fp2);
            if (bufsize == -1) { /* Error */ }

            /* Allocate our buffer to that size. */
            fShaderCode = malloc(sizeof(char) * (bufsize + 1));

            /* Go back to the start of the file. */
            if (fseek(fp2, 0L, SEEK_SET) != 0) { /* Error */ }

            /* Read the entire file into memory. */
            size_t newLen = fread(fShaderCode, sizeof(char), bufsize, fp2);
            if ( ferror( fp2 ) != 0 ) {
                fputs("Error reading file", stderr);
            } else {
                fShaderCode[newLen++] = '\0'; /* Just to be safe. */
            }
        }
        fclose(fp2);
    }

    // compile shaders
    unsigned int vertex, fragment;
    // vertex shader
    vertex = glCreateShader(GL_VERTEX_SHADER);
    glShaderSource(vertex, 1, &vShaderCode, NULL);
    glCompileShader(vertex);
    checkCompileErrors(vertex, "VERTEX");
    // fragment Shader
    fragment = glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(fragment, 1, &fShaderCode, NULL);
    glCompileShader(fragment);
    checkCompileErrors(fragment, "FRAGMENT");
    // shader Program
    unsigned int ID = glCreateProgram();
    glAttachShader(ID, vertex);
    glAttachShader(ID, fragment);
    glLinkProgram(ID);
    checkCompileErrors(ID, "PROGRAM");
    // delete the shaders as they're linked into our program now and no longer necessary
    glDeleteShader(vertex);
    free(vShaderCode); // memory leak = bad
    glDeleteShader(fragment);
    free(fShaderCode); // memory leak = bad

    return ID;
}

void useShader(unsigned int shader)
{
    glUseProgram(shader);
}

void setVec2(unsigned int shader, const char* name, float x, float y)
{
    glUniform2f(glGetUniformLocation(shader, name), x, y);
}

void setVec3(unsigned int shader, const char* name, float x, float y, float z)
{
    glUniform3f(glGetUniformLocation(shader, name), x, y, z);
}

void checkCompileErrors(unsigned int shader, const char* type)
{
    int success;
    char infoLog[1024];
    if (type != "PROGRAM")
    {
        glGetShaderiv(shader, GL_COMPILE_STATUS, &success);
        if (!success)
        {
            glGetShaderInfoLog(shader, 1024, NULL, infoLog);
            printf("ERROR::SHADER_COMPILATION_ERROR of type: %s\n%s\n -- --------------------------------------------------- -- ", type, infoLog);
        }
    }
    else
    {
        glGetProgramiv(shader, GL_LINK_STATUS, &success);
        if (!success)
        {
            glGetProgramInfoLog(shader, 1024, NULL, infoLog);
            printf("ERROR::SHADER_COMPILATION_ERROR of type: %s\n%s\n -- --------------------------------------------------- -- ", type, infoLog);
        }
    }
}

unsigned int createVAO()
{
    unsigned int VAO;
    glGenVertexArrays(1, &VAO);
    glBindVertexArray(VAO);

    return VAO;
}

unsigned int createVBO()
{
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

    return VBO;
}
