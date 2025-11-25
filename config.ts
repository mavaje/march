import {f32, struct, u32, vec3f} from "./byte-packing/byte-types";
import {Packer} from "./byte-packing/packer";

export class Config {

    private packer = new Packer(struct({
        ambient_light: f32,
        diffuse_light: f32,
        specular_light: f32,
        shadows: u32,
        sun_direction: vec3f,
        view_direction: vec3f,
    }));

    static struct = new Config().packer.type;

    constructor(
        public ambient_light: number = 0.25,
        public diffuse_light: number = 1,
        public specular_light: number = 1,
        public shadows: boolean = true,
        public sun_azimuth: number = 1,
        public sun_altitude: number = 1,
        public view_azimuth: number = 0.5,
        public view_altitude: number = 0.5,
    ) {}

    buffer() {
        this.packer.set_struct(this);

        this.sun_altitude = Math.max(-Math.PI / 2, Math.min(this.sun_altitude, Math.PI / 2));
        this.view_altitude = Math.max(-Math.PI / 2, Math.min(this.view_altitude, Math.PI / 2));

        this.packer.set('sun_direction', [
            Math.sin(this.sun_azimuth) * Math.cos(this.sun_altitude),
            -Math.sin(this.sun_altitude),
            Math.cos(this.sun_azimuth) * Math.cos(this.sun_altitude),
        ]);

        this.packer.set('view_direction', [
            Math.sin(this.view_azimuth) * Math.cos(this.view_altitude),
            -Math.sin(this.view_altitude),
            Math.cos(this.view_azimuth) * Math.cos(this.view_altitude),
        ]);

        return this.packer.buffer;
    }
}
