fn hit_torus(origin: vec3f, torus: Torus) -> Hit {
    let relative_origin = origin - torus.centre;
    return Hit(
        length(vec2f(
            length(relative_origin.xy) - torus.radius_major,
            abs(origin.z - torus.centre.z)
        )) - torus.radius_minor,
        normalize(relative_origin - vec3f(
            torus.radius_major * normalize(relative_origin.xy),
            0.0,
        )),
        torus.material,
     );
}
