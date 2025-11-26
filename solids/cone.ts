import {f32, struct, vec3f} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Solid} from "./solid";
import {Material} from "./material";

export class Cone extends Solid {

    static name = 'cone';

    constructor(
        public centre: DOMPoint = new DOMPoint(0, 0, 0),
        public angle: number = Math.PI / 4,
        material?: Material,
    ) {
        super(material);

        this.packer = new Packer(struct('Cone', {
            centre: vec3f,
            sin: f32,
            cos: f32,
            material: Material.struct,
        }));
    }

    get sin() {
        return Math.sin(this.angle);
    }

    get cos() {
        return Math.cos(this.angle);
    }
}
