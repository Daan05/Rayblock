#version 460 core
out vec4 FragColor;

uniform vec2 screenDimensions;
uniform vec3 lookFrom;
uniform mat4 invProj;
uniform mat4 invView;

layout(std430, binding = 1) readonly buffer mybuffer {
    int vecMap[];
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

Hit sphereIntersection(Ray ray, Sphere sphere);
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

    ivec3 vMapSize = ivec3(50, 50, 50);

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
		}
		else if (vRayLength1D.y < vRayLength1D.z)
		{
			vMapCheck.y += vStep.y;
			fDistance = vRayLength1D.y;
			vRayLength1D.y += vRayUnitStepSize.y;
		}
        else
        {
            vMapCheck.z += vStep.z;
			fDistance = vRayLength1D.z;
			vRayLength1D.z += vRayUnitStepSize.z;
        }

		// Test tile at new test point
		if (vMapCheck.x >= 0 && vMapCheck.x < vMapSize.x && vMapCheck.y >= 0 && vMapCheck.y < vMapSize.y && vMapCheck.z >= 0 && vMapCheck.z < vMapSize.y)
		{
		    if (vecMap[vMapCheck.z * 2500 + vMapCheck.y * 50 + vMapCheck.x] == 1)
		    {
			    bTileFound = true;
		    }
		}
	}
	// Calculate intersection location
	vec3 vIntersection;
	if (bTileFound)
	{
		vIntersection = vRayStart + vRayDir * fDistance;
	}
    else 
    {
        vIntersection = vec3(0);
    }

	FragColor = vec4(vec3(length(vIntersection - lookFrom) * 0.01), 1.0);
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

vec3 calculateLighting(Ray ray, Hit hit) {

    vec3 lPos = vec3(-2000.0, 2000.0, -2000.0);
    vec3 lCol = vec3(1.0);

    vec3 ambient = vec3(0);
    vec3 diffuse = vec3(0);
    vec3 specular = vec3(0);

    //combine the surface color with the light's color/intensity
    vec3 effective_color = hit.color * lCol;
    //find the direction to the light source
    vec3 lightv = normalize(lPos - (ray.origin + ray.direction * hit.t));
    //compute the ambient contribution
    ambient = 0.1 * effective_color;

    //light_dot_normal represents the cosine of the angle between the
    //light vector and the normal vector.A negative number means the
    //light is on the other side of the surface.
    float light_dot_normal = dot(lightv, hit.normal);
    if (light_dot_normal > 0)
    {
	    //compute the diffuse contribution
	    diffuse = effective_color * 0.9 * light_dot_normal;
	    //reflect_dot_eye represents the cosine of the angle between the
	    //reflection vector and the eye vector.A negative number means the
	    //light reflects away from the eye.
	    vec3 reflectv = reflect(lightv, hit.normal);
	    float reflect_dot_eye = dot(reflectv, ray.direction);
	    if (reflect_dot_eye >= 0)
	    {
		    //compute the specular contribution
		    float factor = pow(reflect_dot_eye, 200);
		    specular = lCol * factor * 0.9;
	    }
    }
    //Add the three contributions together to get the final shading
    return ambient + diffuse + specular;
}
