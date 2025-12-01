fn hit_cube(origin: vec3f, cube: Cube) -> Hit {
    let offset = origin - cube.centre;
    let distance = abs(offset) - cube.size / 2.0;
    let hit_x = Hit(distance.x, vec3f(sign(offset.x), 0.0, 0.0), cube.material);
    let hit_y = Hit(distance.y, vec3f(0.0, sign(offset.y), 0.0), cube.material);
    let hit_z = Hit(distance.z, vec3f(0.0, 0.0, sign(offset.z)), cube.material);

    return hit_intersection(
        hit_intersection(
            hit_x,
            hit_y,
            cube.smoothing,
        ),
        hit_z,
        cube.smoothing,
    );
}
