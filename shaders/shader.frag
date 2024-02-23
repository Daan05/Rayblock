#version 460 core
out vec4 FragColor;

uniform vec2 screenDimensions;
uniform vec3 lookFrom;
uniform mat4 invProj;
uniform mat4 invView;

struct Voxel
{
    uint type;
    int xPos;
    int yPos;
    int zPos;
};

const uint voxelCount = 1000;
layout(std430, binding = 1) readonly buffer mybuffer {
    uint types[voxelCount];
    int xCoords[voxelCount];
    int yCoords[voxelCount];
    int zCoords[voxelCount];
};

struct Ray
{
    vec3 origin;
    vec3 direction;
    vec3 inv;
};

struct Hit {
    float t;
    vec3 color;
    vec3 normal;
};

struct Sphere
{
    vec3 center;
    float radius;
    vec3 color;
};

struct AABB
{
    vec3 min;
    vec3 max;
    vec3 color;
};

Hit sphereIntersection(Ray ray, Sphere sphere);
Hit aabbIntersection(Ray ray, AABB aabb, float t);
vec3 calculateLighting(Ray ray, Hit hit);

void main()
{
    vec2 uv = vec2(gl_FragCoord.x / screenDimensions.x, gl_FragCoord.y / screenDimensions.y) * 2.0 - 1.0;
    vec3 color = vec3(0.1);

    vec4 target = invProj * vec4(uv.x, uv.y, 1, 1);
	vec3 rayDirection = normalize(vec3(invView * normalize(target))); // World space

    Ray r;
    r.origin = lookFrom;
    r.direction = rayDirection;

    //fillMap();

    // Form ray cast from player into scene
	vec3 vRayStart = r.origin;
	vec3 vRayDir = r.direction;
			
	// Lodev.org also explains this additional optimistaion (but it's beyond scope of video)
	vec3 vRayUnitStepSize = { abs(1.0 / vRayDir.x), abs(1.0 / vRayDir.y), abs(1.0 / vRayDir.z) };
	ivec3 vMapCheck = ivec3(int(vRayStart.x), int(vRayStart.y), int(vRayStart.z));
	vec3 vRayLength1D;
	ivec3 vStep;
	// Establish Starting Conditions
	if (vRayDir.x < 0)
	{
		vStep.x = -1;
		vRayLength1D.x = (vRayStart.x - float(vMapCheck.x)) * vRayUnitStepSize.x;
	}
	else
	{
		vStep.x = 1;
		vRayLength1D.x = (float(vMapCheck.x + 1) - vRayStart.x) * vRayUnitStepSize.x;
	}
	if (vRayDir.y < 0)
	{
		vStep.y = -1;
		vRayLength1D.y = (vRayStart.y - float(vMapCheck.y)) * vRayUnitStepSize.y;
	}
	else
	{
		vStep.y = 1;
		vRayLength1D.y = (float(vMapCheck.y + 1) - vRayStart.y) * vRayUnitStepSize.y;
	}
    if (vRayDir.z < 0)
	{
		vStep.z = -1;
		vRayLength1D.z = (vRayStart.z - float(vMapCheck.z)) * vRayUnitStepSize.z;
	}
	else
	{
		vStep.z = 1;
		vRayLength1D.z = (float(vMapCheck.z + 1) - vRayStart.z) * vRayUnitStepSize.z;
	}

    uvec3 vMapSize = uvec3(10, 10, 10);
    ivec3 pos;
    vec3 normal;
    Hit hit;

	// Perform "Walk" until collision or range check
	bool bTileFound = false;
	float fMaxDistance = 512.0;
	float fDistance = 0.0;
	while (!bTileFound && fDistance < fMaxDistance)
	{
		// Walk along shortest path
		if (vRayLength1D.x < vRayLength1D.y && vRayLength1D.x < vRayLength1D.z)
		{
			vMapCheck.x += vStep.x;
			fDistance = vRayLength1D.x;
			vRayLength1D.x += vRayUnitStepSize.x;

            normal = vec3(-1, 0, 0);
		}
		else if (vRayLength1D.y < vRayLength1D.z)
		{
			vMapCheck.y += vStep.y;
			fDistance = vRayLength1D.y;
			vRayLength1D.y += vRayUnitStepSize.y;

            normal = vec3(0, -1, 0);
		}
        else
        {
            vMapCheck.z += vStep.z;
			fDistance = vRayLength1D.z;
			vRayLength1D.z += vRayUnitStepSize.z;

            normal = vec3(0, 0, -1);
        }

		// Test tile at new test point
		if (vMapCheck.x >= 0 && vMapCheck.x < vMapSize.x && vMapCheck.y >= 0 && vMapCheck.y < vMapSize.y && vMapCheck.z >= 0 && vMapCheck.z < vMapSize.y)
		{
            int index = vMapCheck.z * 100 + vMapCheck.y * 10 + vMapCheck.x;
            pos = ivec3(xCoords[index], yCoords[index], zCoords[index]);
		    if (types[index] == 1)
		    {
                bTileFound = true;
                hit.t = fDistance;
                hit.color = vec3(0.5, 0.2, 0.6);
                hit.normal = normal * vStep;
		    }
		}
	}

	if (bTileFound)
	{
        color = calculateLighting(r, hit);
	}

	FragColor = vec4(color, 1.0);
}

Hit sphereIntersection(Ray ray, Sphere sphere) {

    float a = dot(ray.direction, ray.direction);
    float b = 2.0 * dot(ray.direction, ray.origin - sphere.center);
    float c = dot(ray.origin - sphere.center, ray.origin - sphere.center) - sphere.radius * sphere.radius;
    float discriminant = b * b - 4.0 * a * c;

    // miss
    if (discriminant < 0) {
        return Hit(-1.0, vec3(0), vec3(0));
    }

    // hit
    float t1 = (-b - sqrt(discriminant)) / (2 * a);
    float t2 = (-b + sqrt(discriminant)) / (2 * a);
    float t = min(t1, t2);

    return Hit(t, sphere.color, normalize((ray.origin + ray.direction * t) - sphere.center));
}

Hit aabbIntersection(Ray ray, AABB aabb, float t)
{
    vec3 intersection = ray.origin + ray.direction * t;
    vec3 p = intersection;
    vec3 normal = vec3(0, 1, 0);

    float epsilon = 0.1;
    if (abs(p.x - aabb.max.x) < epsilon)
        normal = vec3(1, 0, 0);
    else if (abs(p.x - aabb.min.x) < epsilon)
        normal = vec3(-1, 0, 0);

    if (abs(p.y - aabb.max.y) < epsilon)
        normal = vec3(0, 1, 0);
    else if (abs(p.y - aabb.min.y) < epsilon)
        normal = vec3(0, -1, 0);

    if (abs(p.z - aabb.max.z) < epsilon)
        normal = vec3(0, 0, 1);
    else if (abs(p.z - aabb.min.z) < epsilon)
        normal = vec3(0, 0, -1);

    return Hit(t, vec3(abs(normal.x), abs(normal.y), abs(normal.z)), normal);
}

vec3 calculateLighting(Ray ray, Hit hit) {

    vec3 lPos = vec3(5, 12, 5);
    vec3 lCol = vec3(1.0);

    vec3 ambient = vec3(0);
    vec3 diffuse = vec3(0);
    vec3 specular = vec3(0);

    vec3 effective_color = hit.color * lCol;
    vec3 lightv = normalize(lPos - (ray.origin + ray.direction * hit.t));
    ambient = 0.1 * effective_color;

    float light_dot_normal = dot(lightv, hit.normal);
    if (light_dot_normal > 0)
    {
	    diffuse = effective_color * 0.9 * light_dot_normal;
	    vec3 reflectv = reflect(lightv, hit.normal);
	    float reflect_dot_eye = dot(reflectv, ray.direction);
	    if (reflect_dot_eye >= 0)
	    {
		    float factor = pow(reflect_dot_eye, 200);
		    specular = lCol * factor * 0.9;
	    }
    }
    return ambient + diffuse + specular;
}
