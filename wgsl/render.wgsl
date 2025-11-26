struct Ray {
    origin: vec3f,
    direction: vec3f,
};

struct Hit {
    distance: f32,
    normal: vec3f,
    material: Material,
}

struct March {
    hit: Hit,
    position: vec3f,
    iterations: u32,
}

const MAX_ITERATIONS: u32 = 2 << 8;

@compute @workgroup_size(render_workgroup_size)
fn render(
    @builtin(global_invocation_id)
    id: vec3u
) {
    let pixel = id.xy;
    let right = normalize(cross((config.view_direction), select(
        vec3f(0, 0, 1),
        vec3f(0, 1, 0),
        abs(config.view_direction.y) < 1.0 - EPSILON
    )));
    let up = normalize(cross(config.view_direction, right));
    let screen = 2.0 * vec2f(pixel) / canvas_size - 1.0;

    let ray: Ray = Ray(
        right * screen.x + up * screen.y - 2.0 * config.view_direction,
        config.view_direction,
    );

    var colour = vec3f(0.0);
    var alpha: f32 = 0.0;

    let ray_march = march(ray);

    if (march_hit(ray_march)) {
        let normal = ray_march.hit.normal;
        let material = ray_march.hit.material;

        // ambient
        colour += material.ambient * config.ambient_light;

        var in_light: bool;

        if (config.shadows > 0) {
            in_light = !march_hit(march(Ray(
                ray_march.position - 1e-4 * config.sun_direction,
                -config.sun_direction,
            )));
        } else {
            in_light = true;
        }

        if (in_light) {
            // diffuse
            colour += material.diffuse
                * config.diffuse_light
                * max(-dot(config.sun_direction, normal), 0.0);

            // specular
            colour += material.specular
                * config.specular_light
                * pow(max(-dot(reflect(config.sun_direction, normal), ray.direction), 0.0), 16.0);
        }

        alpha = 1.0;
    }

    textureStore(texture, pixel, vec4f(colour, alpha));
}

fn march(ray: Ray) -> March {
    var origin: vec3f = ray.origin;
    var iteration: u32 = 0;
    loop {
        let hit = HIT_INJECTION;

        if (abs(hit.distance) < EPSILON &&
            dot(ray.direction, hit.normal) < 0.0
        ) {
            return March(hit, origin, iteration);
        } else {
            origin += hit.distance * ray.direction;
            iteration++;
            if (iteration > MAX_ITERATIONS) {
                return March(Hit(), vec3f(), iteration);
            }
        }
    }
}

fn march_hit(march: March) -> bool {
    return march.iterations <= MAX_ITERATIONS;
}
