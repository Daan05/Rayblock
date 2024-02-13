#ifndef SHADER_H
#define SHADER_H
#include <glad/glad.h>

#include <stdio.h>
#include <stdlib.h>

unsigned int createShaderProgram(const char* vertexShaderPath, const char* fragmentShaderPath);
void useShader(unsigned int shader);
// set int, float, vec3 etc.
void checkCompileErrors(unsigned int shader, const char* type);

unsigned int createVAO();
unsigned int createVBO();

#endif