import {f32, struct, vec3f} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Solid} from "./solid";

export class Plane extends Solid {

    static name = 'plane';

    constructor(
        public normal: DOMPoint = new DOMPoint(0, 1, 0),
        public distance: number = 0,
    ) {
        super();

        this.packer = new Packer(struct({
            normal: vec3f,
            distance: f32,
        }));
    }
}
