import {f32, struct, vec3f} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Material} from "../material";
import {Primitive} from "./primitive";
import {Vector} from "../vector";

export class Torus extends Primitive {

    static name = 'torus';
    static observedAttributes = ['centre', 'radius_major', 'radius_minor'];

    public centre: Vector;
    public radius_major: number;
    public radius_minor: number;

    constructor(material?: Material) {
        super(material);

        this.packer = new Packer(struct('Torus', {
            centre: vec3f,
            radius_major: f32,
            radius_minor: f32,
            material: Material.struct,
        }));
    }

    update() {
        this.centre = this.attribute_vector('centre', [0, 0, 0]);
        this.radius_major = this.attribute_numeric('radius_major', 0.75);
        this.radius_minor = this.attribute_numeric('radius_minor', 0.25);
    }
}
