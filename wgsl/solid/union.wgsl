fn hit_union(hit_a: Hit, hit_b: Hit, radius: f32) -> Hit {
    if (hit_a.distance < radius &&
        hit_b.distance < radius
    ) {
        let offset = vec2f(hit_a.distance, hit_b.distance) - radius;
        let angle = atan(offset.y / offset.x);
        let blend = abs(angle * 2.0 / PI);
        return Hit(
            radius - length(offset),
            normalize(
                hit_a.normal * cos(angle) +
                hit_b.normal * sin(angle)
            ),
            Material(
                mix(hit_a.material.ambient, hit_b.material.ambient, blend),
                mix(hit_a.material.diffuse, hit_b.material.diffuse, blend),
                mix(hit_a.material.specular, hit_b.material.specular, blend),
            ),
        );
    }

    if (hit_a.distance < hit_b.distance) {
        return hit_a;
    } else {
        return hit_b;
    }
}
