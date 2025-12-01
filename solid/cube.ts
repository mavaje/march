import {f32, struct, vec3f} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Material} from "../material";
import {Primitive} from "./primitive";
import {Vector} from "../vector";

export class Cube extends Primitive {

    static name = 'cube';
    static observedAttributes = ['centre', 'size', 'smoothing'];

    public centre: Vector;
    public size: Vector;
    public smoothing: number;

    constructor(material?: Material) {
        super(material);

        this.packer = new Packer(struct('Cube', {
            centre: vec3f,
            size: vec3f,
            smoothing: f32,
            material: Material.struct,
        }));
    }

    update() {
        this.centre = this.attribute_vector('centre', [0, 0, 0]);
        this.size = this.attribute_vector('size', [1, 1, 1]);
        this.smoothing = this.attribute_numeric('smoothing', 0);
    }
}
