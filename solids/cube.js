import { f32, struct, vec3f } from "../byte-packing/byte-types";
import { Packer } from "../byte-packing/packer";
import { Solid } from "./solid";
export class Cube extends Solid {
    centre;
    size;
    radius;
    static name = 'cube';
    constructor(centre = new DOMPoint(0, 0, 0), size = 1, radius = 0) {
        super();
        this.centre = centre;
        this.size = size;
        this.radius = radius;
        this.packer = new Packer(struct({
            centre: vec3f,
            size: vec3f,
            radius: f32,
        }));
    }
    buffer() {
        if (!(this.size instanceof DOMPoint)) {
            this.size = new DOMPoint(this.size, this.size, this.size);
        }
        return super.buffer();
    }
}
