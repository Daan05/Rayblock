#include "camera.hpp"

Camera::Camera(float verticalFOV, float nearClip, float farClip, unsigned int ID, GLFWwindow* _window)
	: m_VerticalFOV(verticalFOV), m_NearClip(nearClip), m_FarClip(farClip), shaderID(ID), window(_window)
{
	m_ForwardDirection = glm::vec3(0, 0, -1);
	m_Position = glm::vec3(5, 5, 5);
}

bool Camera::OnUpdate(float ts)
{
    double mouseX;
    double mouseY;
    glfwGetCursorPos(window, &mouseX, &mouseY);
    glm::vec2 mousePos = { mouseX, mouseY };
    glm::vec2 delta = { 0.0, 0.0 };
	
	if (glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_LEFT) == GLFW_PRESS)
	{
		delta = (mousePos - m_LastMousePosition) * 0.006f;
	}
    m_LastMousePosition = { mouseX, mouseY };

	bool moved = false;

	constexpr glm::vec3 upDirection(0.0f, 1.0f, 0.0f);
	glm::vec3 rightDirection = glm::cross(m_ForwardDirection, upDirection);

	float speed = 5.0f;

	// Movement
	if (glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS)
	{
		m_Position += m_ForwardDirection * speed * ts;
		moved = true;
	}
	else if (glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS)
	{
		m_Position -= m_ForwardDirection * speed * ts;
		moved = true;
	}
	if (glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS)
	{
		m_Position -= rightDirection * speed * ts;
		moved = true;
	}
	else if (glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS)
	{
		m_Position += rightDirection * speed * ts;
		moved = true;
	}
	if (glfwGetKey(window, GLFW_KEY_Q) == GLFW_PRESS)
	{
		m_Position -= upDirection * speed * ts;
		moved = true;
	}
	else if (glfwGetKey(window, GLFW_KEY_E) == GLFW_PRESS)
	{
		m_Position += upDirection * speed * ts;
		moved = true;
	}

	// Rotation
	if (delta.x != 0.0f || delta.y != 0.0f)
	{
		float pitchDelta = delta.y * GetRotationSpeed();
		float yawDelta = delta.x * GetRotationSpeed();

		glm::quat q = glm::normalize(glm::cross(glm::angleAxis(-pitchDelta, rightDirection), glm::angleAxis(-yawDelta, glm::vec3(0.f, 1.0f, 0.0f))));
		m_ForwardDirection = glm::rotate(q, m_ForwardDirection);

		moved = true;
	}

	if (moved)
	{
		RecalculateView();
	}

	return moved;
}

void Camera::setUniforms()
{
    glUniform3f(glGetUniformLocation(shaderID, "lookFrom"), m_Position.x, m_Position.y, m_Position.z);
    glUniformMatrix4fv(glGetUniformLocation(shaderID, "invProj"), 1, GL_FALSE, glm::value_ptr(m_InverseProjection));
    glUniformMatrix4fv(glGetUniformLocation(shaderID, "invView"), 1, GL_FALSE, glm::value_ptr(m_InverseView));
}

void Camera::resize(int width, int height)
{
	if (width == m_ViewportWidth && height == m_ViewportHeight)
		return;

	m_ViewportWidth = width;
	m_ViewportHeight = height;

	RecalculateProjection();
}

float Camera::GetRotationSpeed()
{
	return 0.3f;
}

void Camera::RecalculateProjection()
{
	m_Projection = glm::perspectiveFov(glm::radians(m_VerticalFOV), (float)m_ViewportWidth, (float)m_ViewportHeight, m_NearClip, m_FarClip);
	m_InverseProjection = glm::inverse(m_Projection);
}

void Camera::RecalculateView()
{
	m_View = glm::lookAt(m_Position, m_Position + m_ForwardDirection, glm::vec3(0, 1, 0));
	m_InverseView = glm::inverse(m_View);
}
