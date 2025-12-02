fn repeat_origin(origin: vec3f, repeat: Repeat) -> vec3f {
    return select(
        origin,
        origin - repeat.step * floor((origin - repeat.start) / repeat.step) - repeat.start,
        select(
            vec3<bool>(false),
            origin >= repeat.start,
            origin < repeat.end,
        ),
    );
}
