fn hit_cylinder(origin: vec3f, cylinder: Cylinder) -> Hit {
    let true_origin = cross(cylinder.centre - origin, cylinder.direction);
    let length = length(true_origin);
    return Hit(
        length - cylinder.radius,
        cross(true_origin / length, cylinder.direction),
        cylinder.material,
     );
}
