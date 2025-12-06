fn repeat_origin(origin: vec3f, repeat: Repeat) -> vec3f {
    return select(
        select(
            origin - repeat.step * floor((origin - repeat.start) / repeat.step) - repeat.start,
            origin - repeat.end + repeat.step,
            origin >= repeat.end,
        ),
        origin - repeat.start,
        origin < repeat.start,
    );
}
