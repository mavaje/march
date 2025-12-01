import {struct, u32, vec3f} from "./byte-packing/byte-types";
import {Packer} from "./byte-packing/packer";
import {Sun} from "./light/sun";

export class Config {

    private packer = new Packer(struct('Config', {
        sun: Sun.struct,
        shadows: u32,
        view_direction: vec3f,
    }));

    static struct = new Config().packer.type;

    public sun: Sun;
    public shadows: boolean = true;

    public view_azimuth: number = 0.5;
    public view_altitude: number = 0.5;

    buffer() {
        this.view_altitude = Math.max(-Math.PI / 2, Math.min(this.view_altitude, Math.PI / 2));

        this.packer.set(this);

        this.packer.set('view_direction', [
            Math.sin(this.view_azimuth) * Math.cos(this.view_altitude),
            -Math.sin(this.view_altitude),
            Math.cos(this.view_azimuth) * Math.cos(this.view_altitude),
        ]);

        return this.packer.buffer;
    }
}
