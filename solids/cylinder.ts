import {f32, struct, vec2f} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Solid} from "./solid";
import {Material} from "./material";

export class Cylinder extends Solid {

    static name = 'cylinder';

    constructor(
        public radius: number = 1,
        public centre: DOMPoint = new DOMPoint(0, 0),
        material?: Material,
    ) {
        super(material);

        this.packer = new Packer(struct('Cylinder', {
            centre: vec2f,
            radius: f32,
            material: Material.struct,
        }));
    }
}
