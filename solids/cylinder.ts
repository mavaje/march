import {f32, struct, vec2f} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Solid} from "./solid";

export class Cylinder extends Solid {

    static name = 'cylinder';

    constructor(
        public radius: number = 1,
        public centre: DOMPoint = new DOMPoint(0, 0),
    ) {
        super();

        this.packer = new Packer(struct({
            centre: vec2f,
            radius: f32,
        }));
    }
}
