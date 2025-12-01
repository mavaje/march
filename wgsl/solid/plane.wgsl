fn hit_plane(origin: vec3f, plane: Plane) -> Hit {
    return Hit(
        dot(plane.normal, origin) - plane.offset,
        plane.normal,
        plane.material,
     );
}
