import {f32, struct, vec3f} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Solid} from "./solid";

export class Cube extends Solid {

    static name = 'cube';

    constructor(
        public centre: DOMPoint = new DOMPoint(0, 0, 0),
        public size: number|DOMPoint = 1,
        public radius: number = 0,
    ) {
        super();

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
