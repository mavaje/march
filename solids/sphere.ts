import {f32, struct, vec3f} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Solid} from "./solid";
import {Material} from "./material";

export class Sphere extends Solid {

    static name = 'sphere';

    constructor(
        public radius: number = 1,
        public centre: DOMPoint = new DOMPoint(0, 0, 0),
        material?: Material,
    ) {
        super(material);

        this.packer = new Packer(struct('Sphere', {
            centre: vec3f,
            radius: f32,
            material: Material.struct,
        }));
    }
}
