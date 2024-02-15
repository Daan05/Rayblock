#version 460 core
out vec4 FragColor;

uniform vec2 screenDimensions;
uniform vec3 camPos;
uniform vec3 orientation;

const vec3 vup = vec3(0.0, 1.0, 0.0);

struct Hit {
    float t;
    vec3 color;
    vec3 normal;
};

struct Ray
{
    vec3 origin;
    vec3 direction;
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
    vec2 uv = (vec2(gl_FragCoord.x / screenDimensions.x, gl_FragCoord.y / screenDimensions.y) - 0.5) * 2; // uv [-1, 1]
    uv.y /= screenDimensions.x / screenDimensions.y;
    vec3 color = vec3(0.7);

    Ray ray;
    ray.origin = camPos;
    vec3 w = normalize(camPos - orientation);
    vec3 u = normalize(cross(vup, w));
    vec3 v = cross(w, u);
    ray.direction = normalize(orientation + uv.x * -u * 0.5 + uv.y * v * 0.5);

    Sphere sphere1;
    sphere1.center = vec3(-12.0, 10.0, 0.0);
    sphere1.radius = 10;
    sphere1.color = vec3(0.2, 0.6, 0.8);

    Sphere sphere2;
    sphere2.center = vec3(12.0, 10.0, 0.0);
    sphere2.radius = 10;
    sphere2.color = vec3(0.4, 0.9, 0.1);

    Hit hit;
    hit.t = 1000000000;

    Hit hits[2];
    hits[0] = sphereIntersection(ray, sphere1);
    hits[1] = sphereIntersection(ray, sphere2);

    for (int i = 0; i < 2; i++)
    {
        if (hits[i].t < hit.t && hits[i].t > 5)
        {
            hit = hits[i];
        }
    }

    if (hit.t > 5 && hit.t < 1000000000)
    {
        color = calculateLighting(ray, hit);
    }

	FragColor = vec4(color, 1.0);
    // why oval?
    // https://stackoverflow.com/questions/18174076/raytracing-why-is-my-sphere-rendered-as-an-oval
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
