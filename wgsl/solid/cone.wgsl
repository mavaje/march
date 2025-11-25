fn hit_cone(origin: vec3f, cone: Cone) -> Hit {
    return Hit(
        cone.cos * distance(origin.xy, cone.centre.xy) - cone.sin * abs(origin.z - cone.centre.z),
        vec3f(cone.cos * normalize(origin.xy - cone.centre.xy), cone.sin * sign(cone.centre.z - origin.z)),
    );
}
