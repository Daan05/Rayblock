#version 460 core
out vec4 FragColor;

uniform vec2 screenDimensions;
//uniform vec3 camPos;
//uniform vec3 orientation;

const vec3 vup = vec3(0.0, 1.0, 0.0);

struct Voxel 
{
    vec3 pos;
    uint type;
};

Voxel voxels[1000];

struct Hit {
    float t;
    vec3 color;
    vec3 normal;
};

struct Ray
{
    vec3 origin;
    vec3 direction;
    vec3 inv;
};

struct Sphere
{
    vec3 center;
    float radius;
    vec3 color;
};

struct Box
{
    vec3 min;
    vec3 max;
};

Hit sphereIntersection(Ray ray, Sphere sphere);
bool boxIntersection(Ray ray, Box box);
float getDist(Ray ray, Box box);
vec3 calculateLighting(Ray ray, Hit hit);

int sceneTraversal(Ray ray, float t);
void fillVoxels();

void main()
{
    vec2 uv = vec2(gl_FragCoord.x / screenDimensions.x, gl_FragCoord.y / screenDimensions.y); // uv [0, 1]
    vec3 color = vec3(0.1);

    vec3 lookfrom = vec3(0,0,-1);  // Point camera is looking from
    vec3 lookat = vec3(0,0,0);   // Point camera is looking at
    vec3 vup  = vec3(0,1,0);     // Camera-relative "up" direction

    vec3 center = lookfrom;
    float vfov = 0.5 * 3.1415926;

    float focal_length = length(lookfrom - lookat);
    float theta = vfov;
    float h = tan(theta/2);
    float viewport_height = 2 * h * focal_length;
    float viewport_width = viewport_height * (float(screenDimensions.x)/float(screenDimensions.y));

    // Calculate the u,v,w unit basis vectors for the camera coordinate frame.
    vec3 w = normalize(lookfrom - lookat);
    vec3 u = normalize(cross(vup, w));
    vec3 v = cross(w, u);

    // Calculate the vectors across the horizontal and down the vertical viewport edges.
    vec3 viewport_u = viewport_width * -u;    // Vector across viewport horizontal edge
    vec3 viewport_v = viewport_height * -v;  // Vector down viewport vertical edge

    // Calculate the horizontal and vertical delta vectors from pixel to pixel.
    vec3 pixel_delta_u = viewport_u / float(screenDimensions.x);
    vec3 pixel_delta_v = viewport_v / float(screenDimensions.y);

    // Calculate the location of the upper left pixel.
    vec3 viewport_upper_left = center - (focal_length * w) - viewport_u/2 - viewport_v/2;
    vec3 pixel00_loc = viewport_upper_left + 0.5 * (pixel_delta_u + pixel_delta_v);

    Ray ray;
    ray.origin = center;
    vec3 pixel_center = normalize(pixel00_loc + (gl_FragCoord.x * pixel_delta_u) + (gl_FragCoord.y * pixel_delta_v));
    ray.direction = pixel_center - center;
    //ray.inv = 1 / ray.direction;

    // ----------------------

    Sphere sphere;
    sphere.center = vec3(0, 0, 5);
    sphere.radius = 2;
    sphere.color = vec3(1, 0, 0);

    //float hit = sphereIntersection(ray, sphere);
    //color = vec3(hit);

    //if (hit > 0.0)
    //{
    //    color = vec3(1);//calculateLighting(ray, hit);
    //}
    //color = ray.direction.zzz;

    // ----------------------

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

bool boxIntersection(Ray ray, Box box)
{
    float tx1 = (box.min.x - ray.origin.x) * ray.inv.x;
    float tx2 = (box.max.x - ray.origin.x) * ray.inv.x;

    float tmin = min(tx1, tx2);
    float tmax = max(tx1, tx2);

    float ty1 = (box.min.y - ray.origin.y) * ray.inv.y;
    float ty2 = (box.max.y - ray.origin.y) * ray.inv.y;

    tmin = max(tmin, min(ty1, ty2));
    tmax = min(tmax, max(ty1, ty2));

    float tz1 = (box.min.z - ray.origin.z) * ray.inv.z;
    float tz2 = (box.max.z - ray.origin.z) * ray.inv.z;

    tmin = max(tmin, min(tz1, tz2));
    tmax = min(tmax, max(tz1, tz2));

    return tmax >= tmin && tmax > 0;
}

float getDist(Ray ray, Box box)
{
    float tx1 = (box.min.x - ray.origin.x) * ray.inv.x;
    float tx2 = (box.max.x - ray.origin.x) * ray.inv.x;

    float tmin = min(tx1, tx2);
    float tmax = max(tx1, tx2);

    float ty1 = (box.min.y - ray.origin.y) * ray.inv.y;
    float ty2 = (box.max.y - ray.origin.y) * ray.inv.y;

    tmin = max(tmin, min(ty1, ty2));
    tmax = min(tmax, max(ty1, ty2));

    float tz1 = (box.min.z - ray.origin.z) * ray.inv.z;
    float tz2 = (box.max.z - ray.origin.z) * ray.inv.z;

    tmin = max(tmin, min(tz1, tz2));
    tmax = min(tmax, max(tz1, tz2));

    return tmax; // tmax if inside box // tmin if outside box
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

int sceneTraversal(Ray ray, float t)
// DDA vs Bresenham
// DDA simpler, but Bresenham is faster
// For now i will use DDA
{
    // calculate dx & dy
    int dx = int(ray.direction.x * t) - int(ray.origin.x); 
    int dy = int(ray.direction.y * t) - int(ray.origin.y); 
    int dz = int(ray.direction.z * t) - int(ray.origin.z); 
  
    // calculate steps required for generating pixels 
    int steps = abs(dx) > abs(dy) ? abs(dx) : abs(dy);
    steps = steps > abs(dz) ? steps : abs(dz);
  
    // calculate increment in x & y for each steps 
    float Xinc = dx / float(steps); 
    float Yinc = dy / float(steps); 
    float Zinc = dz / float(steps); 
  
    // Put pixel for each step 
    float X = ray.origin.x; 
    float Y = ray.origin.y;
    float Z = ray.origin.z;
    for (int i = 0; i <= steps; i++) { 
        
        //putpixel(round(X), round(Y), 
        //        RED); // put pixel at (X,Y)

        int index = int(round(Z) * 100 + round(Y) * 10 + round(X));
        if (index < 1000) {
            if (voxels[index].type != 999)
            {
                return index;
            }
        }

        X += Xinc; // increment in x at each step 
        Y += Yinc; // increment in y at each step 
        Z += Zinc; // increment in z at each step 
    } 

    return 0;
}

void fillVoxels()
{
    for (int z = 0; z < 100; z++) {
        for (int y = 0; y < 100; y++) {
            for (int x = 0; x < 100; x++) {
                if (y < 5) {
                    voxels[z * 10000 + y * 100 + x] = Voxel(vec3(x, y, z), 1);
                } else {
                    voxels[z * 10000 + y * 100 + x] = Voxel(vec3(x, y, z), 0);
                }
            }
        }
    }
}
