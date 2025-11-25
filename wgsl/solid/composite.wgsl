fn negative_hit(hit: Hit) -> Hit {
    return Hit(
        -hit.distance,
        -hit.normal,
    );
}

fn smooth_union(hit_a: Hit, hit_b: Hit, radius: f32) -> Hit {
    if (hit_a.distance < radius &&
        hit_b.distance < radius
    ) {
        let offset = vec2f(hit_a.distance, hit_b.distance) - radius;
        let angle = atan(offset.y / offset.x);
        return Hit(
            radius - length(offset),
            normalize(
                hit_a.normal * cos(angle) +
                hit_b.normal * sin(angle)
            )
        );
    }

    if (hit_a.distance < hit_b.distance) {
        return hit_a;
    } else {
        return hit_b;
    }
}

fn smooth_intersection(hit_a: Hit, hit_b: Hit, radius: f32) -> Hit {
    return negative_hit(smooth_union(
        negative_hit(hit_a),
        negative_hit(hit_b),
        radius,
    ));
}

fn smooth_difference(hit_a: Hit, hit_b: Hit, radius: f32) -> Hit {
    return smooth_intersection(hit_a, negative_hit(hit_b), radius);
}
