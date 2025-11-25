import {f32, struct, vec3f} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Solid} from "./solid";

export class Cone extends Solid {

    static name = 'cone';

    constructor(
        public centre: DOMPoint = new DOMPoint(0, 0, 0),
        public angle: number = Math.PI / 4,
    ) {
        super();

        this.packer = new Packer(struct({
            centre: vec3f,
            sin: f32,
            cos: f32,
        }));
    }

    get sin() {
        return Math.sin(this.angle);
    }

    get cos() {
        return Math.cos(this.angle);
    }
}
