#version 460 core
out vec4 FragColor;

void main()
{
    vec2 uv = (vec2(gl_FragCoord.x / 1280, gl_FragCoord.y / 720.0) - 0.5) * 2; // uv [-1, 1]
    uv.x *= 1.77777777778;

	FragColor = vec4(vec3(1.0 - length(uv)), 1.0);
}
