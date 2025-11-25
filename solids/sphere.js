import { f32, struct, vec3f } from "../byte-packing/byte-types";
import { Packer } from "../byte-packing/packer";
import { Solid } from "./solid";
export class Sphere extends Solid {
    radius;
    centre;
    static name = 'sphere';
    constructor(radius = 1, centre = new DOMPoint(0, 0, 0)) {
        super();
        this.radius = radius;
        this.centre = centre;
        this.packer = new Packer(struct({
            centre: vec3f,
            radius: f32,
        }));
    }
}
