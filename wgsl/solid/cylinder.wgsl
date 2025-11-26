fn hit_cylinder(origin: vec3f, cylinder: Cylinder) -> Hit {
    return Hit(
        distance(origin.xy, cylinder.centre) - cylinder.radius,
        vec3f(normalize(origin.xy - cylinder.centre), 0.0),
        cylinder.material,
     );
}
