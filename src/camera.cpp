#include "camera.hpp"

Camera::Camera(int width, int height, glm::vec3 _position)
{
	Camera::width = width;
	Camera::height = height;
	position = _position;
}

void Camera::setUniforms(Shader* shader)
{
	glUniform3f(glGetUniformLocation(shader->ID, "camPos"), position.x, position.y, position.z);
	glUniform3f(glGetUniformLocation(shader->ID, "orientation"), orientation.x, orientation.y, orientation.z);
}

void Camera::Inputs(GLFWwindow* window)
{
	float mult = 5;
    // Handles key inputs
    if (glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS)
    {
    	position += speed * orientation;
    }
    if (glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS)
    {
    	position += speed * glm::normalize(glm::cross(orientation, vup));
    }
    if (glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS)
    {
    	position += speed * -orientation;
    }
    if (glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS)
    {
    	position += speed * -glm::normalize(glm::cross(orientation, vup));
    }
    if (glfwGetKey(window, GLFW_KEY_SPACE) == GLFW_PRESS)
    {
    	position += speed * vup;
    }
    if (glfwGetKey(window, GLFW_KEY_LEFT_CONTROL) == GLFW_PRESS)
    {
    	position += speed * -vup;
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

	    glm::vec3 newOrientation = glm::rotate(orientation, glm::radians(-rotX), glm::normalize(glm::cross(orientation, vup)));

	    if (abs(glm::angle(newOrientation, vup) - glm::radians(90.0f)) <= glm::radians(85.0f))
	    {
		    orientation = newOrientation;
	    }

	    orientation = glm::rotate(orientation, glm::radians(-rotY), vup);
        //std::cout << orientation.x << " " << orientation.y << " " << orientation.z << "\n";

	    glfwSetCursorPos(window, (width / 2.f), (height / 2.f));
    }
    else if (glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_LEFT) == GLFW_RELEASE)
    {
	    glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_NORMAL);
	    firstClick = true;
    }
}
