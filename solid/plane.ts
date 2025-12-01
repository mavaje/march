import {f32, struct, vec3f} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Material} from "../material";
import {Primitive} from "./primitive";
import {Vector} from "../vector";

export class Plane extends Primitive {

    static name = 'plane';
    static observedAttributes = ['normal', 'offset'];

    public normal: Vector;
    public offset: number;

    constructor(material?: Material) {
        super(material);

        this.packer = new Packer(struct('Plane', {
            normal: vec3f,
            offset: f32,
            material: Material.struct,
        }));
    }

    update() {
        this.normal = this.attribute_vector('normal', [0, 1, 0], true);
        this.offset = this.attribute_numeric('offset', 0);
    }
}
