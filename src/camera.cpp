#include "camera.hpp"

Camera::Camera(int width, int height, glm::vec3 position)
{
	Camera::width = width;
	Camera::height = height;
	Position = position;

	glEnable(GL_DEPTH_TEST);
}

void Camera::setUniforms(Shader* shader)
{
	glUniform3f(glGetUniformLocation(shader->ID, "camPos"), Position.x, Position.y, Position.z);
	glUniform3f(glGetUniformLocation(shader->ID, "orientation"), Orientation.x, Orientation.y, Orientation.z);
}

void Camera::Inputs(GLFWwindow* window)
{
	float mult = 5;
    // Handles key inputs
    if (glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS)
    {
    	Position += speed * Orientation;
    }
    if (glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS)
    {
    	Position += speed * -glm::normalize(glm::cross(Orientation, Up));
    }
    if (glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS)
    {
    	Position += speed * -Orientation;
    }
    if (glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS)
    {
    	Position += speed * glm::normalize(glm::cross(Orientation, Up));
    }
    if (glfwGetKey(window, GLFW_KEY_SPACE) == GLFW_PRESS)
    {
    	Position += speed * Up;
    }
    if (glfwGetKey(window, GLFW_KEY_LEFT_CONTROL) == GLFW_PRESS)
    {
    	Position += speed * -Up;
    }
    if (glfwGetKey(window, GLFW_KEY_LEFT_SHIFT) == GLFW_PRESS)
    {
    	speed = 0.4 * mult;
    }
    else if (glfwGetKey(window, GLFW_KEY_LEFT_SHIFT) == GLFW_RELEASE)
    {
    	speed = 0.1 * mult;
    }


    // Handles mouse inputs
    if (glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_LEFT) == GLFW_PRESS)
    {
    	glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_HIDDEN);

        if (firstClick)
	    {
		    glfwSetCursorPos(window, (width / 2.f), (height / 2.f));
		    firstClick = false;
	    }

	    double mouseX;
	    double mouseY;
	    glfwGetCursorPos(window, &mouseX, &mouseY);

	    float rotX = sensitivity * (float)(mouseY - (height / 2.f)) / height;
	    float rotY = sensitivity * (float)(mouseX - (width / 2.f)) / width;

	    glm::vec3 newOrientation = glm::rotate(Orientation, glm::radians(-rotX), glm::normalize(glm::cross(Orientation, Up)));

	    if (abs(glm::angle(newOrientation, Up) - glm::radians(90.0f)) <= glm::radians(85.0f))
	    {
		    Orientation = newOrientation;
	    }

	    Orientation = glm::rotate(Orientation, glm::radians(-rotY), Up);

	    glfwSetCursorPos(window, (width / 2.f), (height / 2.f));
    }
    else if (glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_LEFT) == GLFW_RELEASE)
    {
	    glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_NORMAL);
	    firstClick = true;
    }
}
