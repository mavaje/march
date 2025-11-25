import { f32, struct, vec3f } from "../byte-packing/byte-types";
import { Packer } from "../byte-packing/packer";
import { Solid } from "./solid";
export class Plane extends Solid {
    normal;
    distance;
    static name = 'plane';
    constructor(normal = new DOMPoint(0, 1, 0), distance = 0) {
        super();
        this.normal = normal;
        this.distance = distance;
        this.packer = new Packer(struct({
            normal: vec3f,
            distance: f32,
        }));
    }
}
