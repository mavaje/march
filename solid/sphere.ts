import {f32, struct, vec3f} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Material} from "../material";
import {Primitive} from "./primitive";
import {Vector} from "../vector";

export class Sphere extends Primitive {

    static name = 'sphere';
    static observedAttributes = ['centre', 'radius'];

    public centre: Vector;
    public radius: number;

    constructor(material?: Material) {
        super(material);

        this.packer = new Packer(struct('Sphere', {
            centre: vec3f,
            radius: f32,
            material: Material.struct,
        }));
    }

    update() {
        this.centre = this.attribute_vector('centre', [0, 0, 0]);
        this.radius = this.attribute_numeric('radius', 1);
    }
}
