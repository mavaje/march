import {f32, struct, vec3f} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Solid} from "./solid";
import {Material} from "./material";

export class Cube extends Solid {

    static name = 'cube';

    constructor(
        public centre: DOMPoint = new DOMPoint(0, 0, 0),
        public size: number|DOMPoint = 1,
        public radius: number = 0,
        material?: Material,
    ) {
        super(material);

        this.packer = new Packer(struct('Cube', {
            centre: vec3f,
            size: vec3f,
            radius: f32,
            material: Material.struct,
        }));
    }

    buffer() {
        if (!(this.size instanceof DOMPoint)) {
            this.size = new DOMPoint(this.size, this.size, this.size);
        }

        return super.buffer();
    }
}
