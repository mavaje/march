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

const MAX_MARCH_ITERATIONS: u32 = 2 << 8;
const MAX_REFRACT_ITERATIONS: u32 = 2 << 2;

@compute @workgroup_size(render_workgroup_size)
fn render(
    @builtin(global_invocation_id)
    id: vec3u
) {
    let pixel = id.xy;
    let screen = 2.0 * vec2f(pixel) / canvas_size - 1.0;

    let right = normalize(cross(config.camera.direction, config.camera.up));
    let up = normalize(cross(config.camera.direction, right));

    var ray: Ray = Ray(
        config.camera.origin
            + right * screen.x * config.camera.size.x
            + up * screen.y * config.camera.size.y,
        config.camera.direction,
    );

    var iteration: u32 = 0;
    var scale: vec3f = vec3f(1.0);
    var colour = vec3f(0.0);
    var alpha: f32 = 0.0;

    loop {
        let ray_march = march(ray);

        let material = ray_march.hit.material;

        var ambient: f32 = 0.0;
        var diffuse: f32 = 0.0;
        var specular: f32 = 0.0;

        if (march_hit(ray_march)) {
            let normal = ray_march.hit.normal;

            var in_light: bool;
            if ((config.settings & 1) > 0) {
                in_light = !march_hit(march(Ray(
                    ray_march.position - 1e-4 * config.sun.direction,
                    -config.sun.direction,
                )));
            } else {
                in_light = true;
            }

            ambient = 1.0;

            if (in_light) {
                diffuse = max(-dot(config.sun.direction, normal), 0.0);

                if (dot(ray.direction, normal) < 0.0) {
                    specular = max(-dot(reflect(config.sun.direction, normal), ray.direction), 0.0);
                }
            } else {
                let ambient_march = march(Ray(
                    ray_march.position,
                    normal,
                ));

                if (march_hit(ambient_march)) {
                    ambient = 0.5;
                }
            }

            alpha = 1.0;

        } else {
            break;
        }

        if (iteration > MAX_REFRACT_ITERATIONS || all(scale < vec3f(EPSILON))) {
            break;
        } else {
            let inside_ray = Ray(
                ray_march.position + 1e-4 * config.camera.direction,
                config.camera.direction,
            );

            let inside_march = march(inside_ray);

            if (march_hit(ray_march)) {
                let distance = distance(ray_march.position, inside_march.position);
            }


//                let direction = refract();
            ray = Ray(
                inside_march.position + 1e-4 * config.camera.direction,
                config.camera.direction,
            );
        }

        colour += scale * (
            ambient * config.sun.ambient * material.ambient
            + diffuse * config.sun.diffuse * material.diffuse
            + pow(specular, 16.0) * config.sun.specular * material.specular
        );

        scale *= 1.0 - material.opacity;

        iteration++;
    }



    textureStore(texture, pixel, vec4f(colour, alpha));
}

fn march(ray: Ray) -> March {
    var origin: vec3f = ray.origin;
    var iteration: u32 = 0;
    loop {
        let hit = HIT_INJECTION;

        if (iteration > MAX_MARCH_ITERATIONS
            || (abs(hit.distance) < EPSILON)// &&
                //dot(ray.direction, hit.normal) < 0.0)
        ) {
            return March(hit, origin, iteration);
        } else {
            origin += abs(hit.distance) * ray.direction;
        }

        iteration++;
    }
}

fn march_hit(march: March) -> bool {
    return march.iterations <= MAX_MARCH_ITERATIONS;
}

fn negative_hit(hit: Hit) -> Hit {
    return Hit(
        -hit.distance,
        -hit.normal,
        hit.material,
    );
}
