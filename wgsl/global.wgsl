struct Config {
    ambient_light: f32,
    diffuse_light: f32,
    specular_light: f32,
    shadows: u32,
    sun_direction: vec3f,
    view_direction: vec3f,
}

struct Frame {
    tick: u32,
    time: u32,
    delta: u32,
    solid_count: u32,
}

const PI: f32 = 3.14159265358979323846;
const TAU: f32 = 6.28318530717958647692;

const EPSILON: f32 = 1e-5;

const canvas_size: vec2f = vec2f(canvas_width, canvas_height);

@group(global) @binding(texture)
var texture: texture_storage_2d<canvas_format, write>;

@group(global) @binding(config)
var<uniform> config: Config;

@group(global) @binding(frame)
var<uniform> frame: Frame;
