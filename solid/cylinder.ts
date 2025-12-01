import {f32, struct, vec3f} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Material} from "../material";
import {Primitive} from "./primitive";
import {Vector} from "../vector";

export class Cylinder extends Primitive {

    static name = 'cylinder';
    static observedAttributes = ['centre', 'direction', 'radius'];

    public centre: Vector;
    public direction: Vector;
    public radius: number;

    constructor(material?: Material) {
        super(material);

        this.packer = new Packer(struct('Cylinder', {
            centre: vec3f,
            direction: vec3f,
            radius: f32,
            material: Material.struct,
        }));
    }

    update() {
        this.centre = this.attribute_vector('centre', [0, 0, 0]);
        this.direction = this.attribute_vector('direction', [0, 0, 1], true);
        this.radius = this.attribute_numeric('radius', 1);
    }
}
