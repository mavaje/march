fn hit_difference(hit_a: Hit, hit_b: Hit, radius: f32) -> Hit {
    return hit_intersection(hit_a, negative_hit(hit_b), radius);
}
