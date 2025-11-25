import { f32, struct, vec3f } from "../byte-packing/byte-types";
import { Packer } from "../byte-packing/packer";
import { Solid } from "./solid";
export class Torus extends Solid {
    centre;
    radius_major;
    radius_minor;
    static name = 'torus';
    constructor(centre = new DOMPoint(0, 0, 0), radius_major = 0.75, radius_minor = 0.25) {
        super();
        this.centre = centre;
        this.radius_major = radius_major;
        this.radius_minor = radius_minor;
        this.packer = new Packer(struct({
            centre: vec3f,
            radius_major: f32,
            radius_minor: f32,
        }));
    }
}
