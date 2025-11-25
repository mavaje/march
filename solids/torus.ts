import {f32, struct, vec3f} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Solid} from "./solid";

export class Torus extends Solid {

    static name = 'torus';

    constructor(
        public centre: DOMPoint = new DOMPoint(0, 0, 0),
        public radius_major: number = 0.75,
        public radius_minor: number = 0.25,
    ) {
        super();

        this.packer = new Packer(struct({
            centre: vec3f,
            radius_major: f32,
            radius_minor: f32,
        }));
    }
}
