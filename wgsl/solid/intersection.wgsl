fn hit_intersection(hit_a: Hit, hit_b: Hit, radius: f32) -> Hit {
    return negative_hit(hit_union(
        negative_hit(hit_a),
        negative_hit(hit_b),
        radius,
    ));
}
