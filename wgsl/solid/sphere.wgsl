fn hit_sphere(origin: vec3f, sphere: Sphere) -> Hit {
    return Hit(
        distance(origin, sphere.centre) - sphere.radius,
        normalize(origin - sphere.centre),
        sphere.material,
    );
}
