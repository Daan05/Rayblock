#version 460 core
layout (location = 0) in vec2 aPos;

void main()
{
	gl_Position = vec4(aPos, vec2(1.0));
}