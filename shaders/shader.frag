#version 450
layout(location = 0) out vec4 outColor;

const int objectCount = 25;
const float kEpsilon = 0.00001;

struct Sphere {
    vec3 center;
    float radius;
    vec3 color;
};

struct Camera {
    vec3 position;
    vec3 forwards;
    vec3 right;
    vec3 up;
};

struct Ray {
    vec3 origin;
    vec3 direction;
};

struct Hit {
    float t;
    vec3 color;
    vec3 normal;
};

struct Light {
    vec3 position;
    vec3 intensity;
};

struct Triangle {
    vec3 a;
    vec3 b;
    vec3 c;
    vec3 normal;
    vec3 color;
};

const int triangleCount = 24;
Triangle triangles[triangleCount];
void getTriangles();

Hit sphereIntersection(Ray ray, Sphere sphere);
Hit triangleIntersection(Ray ray, Triangle triangle);
vec3 calculateLighting(Ray ray, Light light, Hit hit);

float random(float a)
{
    uint state = uint(a * 10000) * 747796405u + 2891336453u;
    uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
    uint num = ((word >> 22u) ^ word) / 2u;
    return (1.0 / 2147483648.0) * float(num);
}

void main()
{
    ivec2 screen_pos = ivec2(gl_FragCoord.xy);
    ivec2 screen_size = ivec2(1280, 720);
    float horizontalCoefficient = ((float(screen_pos.x) * 2 - screen_size.x) / screen_size.x);
    float verticalCoefficient = -((float(screen_pos.y) * 2 - screen_size.y) / screen_size.x) - 0.5;

    vec3 background = vec3(0.25);
    vec3 pixel_color = background;

    Camera camera;
    camera.position = vec3(0.0, 1.0, 0.0); 
    camera.forwards = vec3(0.0, 0.0, 1.0);
    camera.right = vec3(1.0, 0.0, 0.0); 
    camera.up = vec3(0.0, 1.0, 0.0);

    Light light;
    light.position = vec3(-20.0, 15.0, -20.0);
    light.intensity = vec3(1.0);

    Sphere sphere;
    sphere.center = vec3(0.0, 0.0, 3.0);
    sphere.radius = 1.0;
    sphere.color = vec3(1.0, 0.3, 0.7);

    Ray ray;
    ray.origin = camera.position;
    ray.direction = camera.forwards + horizontalCoefficient * camera.right + verticalCoefficient * camera.up;

    getTriangles();

    Hit hits[objectCount];
    // check collision for all objects
    hits[0] = Hit(-1.0, vec3(0), vec3(0));//sphereIntersection(ray, sphere);
    hits[1] = triangleIntersection(ray, triangles[0]);
    hits[2] = triangleIntersection(ray, triangles[1]);
    hits[3] = triangleIntersection(ray, triangles[2]);
    hits[4] = triangleIntersection(ray, triangles[3]);
    hits[5] = triangleIntersection(ray, triangles[4]);
    hits[6] = triangleIntersection(ray, triangles[5]);
    hits[7] = triangleIntersection(ray, triangles[6]);
    hits[8] = triangleIntersection(ray, triangles[7]);
    hits[9] = triangleIntersection(ray, triangles[8]);
    hits[10] = triangleIntersection(ray, triangles[9]);
    hits[11] = triangleIntersection(ray, triangles[10]);
    hits[12] = triangleIntersection(ray, triangles[11]);
    hits[13] = triangleIntersection(ray, triangles[12]);
    hits[14] = triangleIntersection(ray, triangles[13]);
    hits[15] = triangleIntersection(ray, triangles[14]);
    hits[16] = triangleIntersection(ray, triangles[15]);
    hits[17] = triangleIntersection(ray, triangles[16]);
    hits[18] = triangleIntersection(ray, triangles[17]);
    hits[19] = triangleIntersection(ray, triangles[18]);
    hits[20] = triangleIntersection(ray, triangles[19]);
    hits[21] = triangleIntersection(ray, triangles[20]);
    hits[22] = triangleIntersection(ray, triangles[21]);
    hits[23] = triangleIntersection(ray, triangles[22]);
    hits[24] = triangleIntersection(ray, triangles[23]);
    // find closest intersection
    Hit hit;
    hit.t = 100;
    for (int i = 0; i < objectCount; i++)
    {
        if (hits[i].t < hit.t && hits[i].t > 0)
        {
            hit = hits[i];
        }
    }

    if (hit.t > 0 && hit.t < 100)
    {
        pixel_color = calculateLighting(ray, light, hit);
    }
    
    outColor = vec4(pixel_color, 1.0);
}

void getTriangles() {

    vec3 p[12];
    p[0] = vec3(1.250000, 0.000000, 2.000000);
    p[1] = vec3(0.875000, 0.216506, 2.000000);
    p[2] = vec3(0.875000, -0.216506, 2.000000); 
    p[3] = vec3(0.000000, 0.000000, 0.750000);
    p[4] = vec3(0.000000, 0.216506, 1.125000);
    p[5] = vec3(0.000000, -0.216506, 1.125000);
    p[6] = vec3(-1.250000, 0.000000, 2.000000);
    p[7] = vec3(-0.875000, 0.216506, 2.000000);
    p[8] = vec3(-0.875000, -0.216506, 2.000000);
    p[9] = vec3(0.000000, 0.000000, 3.250000);
    p[10] = vec3(0.000000, 0.216506, 2.875000);
    p[11] = vec3(0.000000, -0.216506, 2.875000);

    vec3 n[12];
    n[0] = vec3(0.4472, 0.7746, -0.4472);
    n[1] = vec3(-0.7071, -0.0000, 0.7071);
    n[2] = vec3(0.4472, -0.7746, -0.4472);
    n[3] = vec3(-0.4472, 0.7746, -0.4472);
    n[4] = vec3(0.7071, -0.0000, 0.7071);
    n[5] = vec3(-0.4472, -0.7746, -0.4472);
    n[6] = vec3(-0.4472, 0.7746, 0.4472);
    n[7] = vec3(0.7071, -0.0000, -0.7071);
    n[8] = vec3(-0.4472, -0.7746, 0.4472);
    n[9] = vec3(0.4472, 0.7746, 0.4472);
    n[10] = vec3(-0.7071, -0.0000, -0.7071);
    n[11] = vec3(0.4472, -0.7746, 0.4472);

    vec3 color = vec3(87.0/256.0, 65.0/256.0, 47.0/255.0);

    triangles[0] = Triangle(p[0], p[1], p[3], n[0], color);
    triangles[1] = Triangle(p[1], p[3], p[4], n[0], color);

    triangles[2] = Triangle(p[1], p[2], p[4], n[1], color);
    triangles[3] = Triangle(p[2], p[4], p[5], n[1], color);

    triangles[4] = Triangle(p[2], p[0], p[5], n[2], color);
    triangles[5] = Triangle(p[0], p[5], p[3], n[2], color);

    triangles[6] = Triangle(p[3], p[4], p[6], n[3], color);
    triangles[7] = Triangle(p[4], p[6], p[7], n[3], color);

    triangles[8] = Triangle(p[4], p[5], p[7], n[4], color);
    triangles[9] = Triangle(p[5], p[7], p[8], n[4], color);

    triangles[10] = Triangle(p[5], p[3], p[8], n[5], color);
    triangles[11] = Triangle(p[3], p[8], p[6], n[5], color);

    triangles[12] = Triangle(p[6], p[7], p[9], n[6], color);
    triangles[13] = Triangle(p[7], p[9], p[10], n[6], color);

    triangles[14] = Triangle(p[7], p[8], p[10], n[7], color);
    triangles[15] = Triangle(p[8], p[10], p[11], n[7], color);

    triangles[16] = Triangle(p[8], p[6], p[11], n[8], color);
    triangles[17] = Triangle(p[6], p[11], p[9], n[8], color);

    triangles[19] = Triangle(p[9], p[10], p[0], n[9], color);
    triangles[19] = Triangle(p[10], p[0], p[1], n[9], color);

    triangles[20] = Triangle(p[10], p[11], p[1], n[10], color);
    triangles[21] = Triangle(p[11], p[1], p[2], n[10], color);

    triangles[22] = Triangle(p[11], p[9], p[2], n[11], color);
    triangles[23] = Triangle(p[9], p[2], p[0], n[11], color);
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

Hit triangleIntersection(Ray ray, Triangle triangle) {

    vec3 edge1 = triangle.b - triangle.a;
    vec3 edge2 = triangle.c - triangle.a;
    vec3 ray_cross_e2 = cross(ray.direction, edge2);
    float det = dot(edge1, ray_cross_e2);

    if (det > -kEpsilon && det < kEpsilon)
        return Hit(-1.0, vec3(0), vec3(0));    // This ray is parallel to this triangle.

    float inv_det = 1.0 / det;
    vec3 s = ray.origin - triangle.a;
    float u = inv_det * dot(s, ray_cross_e2);

    if (u < 0 || u > 1)
        return Hit(-1.0, vec3(0), vec3(0));

    vec3 s_cross_e1 = cross(s, edge1);
    float v = inv_det * dot(ray.direction, s_cross_e1);

    if (v < 0 || u + v > 1)
        return Hit(-1.0, vec3(0), vec3(0));

    // At this stage we can compute t to find out where the intersection point is on the line.
    float t = inv_det * dot(edge2, s_cross_e1);

    if (t > kEpsilon) // ray intersection
    {
        //vec3 out_intersection_point = ray.origin + ray.direction * t;
        return Hit(t, triangle.color, triangle.normal);
    }
    else // This means that there is a line intersection but not a ray intersection.
        return Hit(-1.0, vec3(0), vec3(0));
}

vec3 calculateLighting(Ray ray, Light light, Hit hit) {

    vec3 ambient = vec3(0);
    vec3 diffuse = vec3(0);
    vec3 specular = vec3(0);

    //combine the surface color with the light's color/intensity
    vec3 effective_color = hit.color * light.intensity;
    //find the direction to the light source
    vec3 lightv = normalize(light.position - (ray.origin + ray.direction * hit.t));
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
		    specular = light.intensity * factor * 0.9;
	    }
    }
    //Add the three contributions together to get the final shading
    return ambient + diffuse + specular;
}
