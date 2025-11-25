import { f32, struct, vec2f } from "../byte-packing/byte-types";
import { Packer } from "../byte-packing/packer";
import { Solid } from "./solid";
export class Cylinder extends Solid {
    radius;
    centre;
    static name = 'cylinder';
    constructor(radius = 1, centre = new DOMPoint(0, 0)) {
        super();
        this.radius = radius;
        this.centre = centre;
        this.packer = new Packer(struct({
            centre: vec2f,
            radius: f32,
        }));
    }
}
