import {f32, struct, vec3f} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Solid} from "./solid";

export class Sphere extends Solid {

    static name = 'sphere';

    constructor(
        public radius: number = 1,
        public centre: DOMPoint = new DOMPoint(0, 0, 0),
    ) {
        super();

        this.packer = new Packer(struct({
            centre: vec3f,
            radius: f32,
        }));
    }
}
