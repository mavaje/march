import {f32, struct, vec3f} from "../../byte-packing/byte-types";
import {Packer} from "../../byte-packing/packer";
import {Material} from "../../material/material";
import {Primitive} from "./primitive";
import {Vector} from "../../vector";
import {Solid} from "../solid";

export class Torus extends Primitive {

    static name = 'torus';
    static observedAttributes = [
        ...Solid.common_attributes,
        'centre',
        'radius-major',
        'radius-minor',
    ];

    public packer = new Packer(struct('Torus', {
        centre: vec3f,
        radius_major: f32,
        radius_minor: f32,
        material: Material.struct,
    }));

    public centre: Vector;
    public radius_major: number;
    public radius_minor: number;

    update() {
        super.update();
        this.centre = this.attribute_vector('centre', Vector.vectors.origin);
        this.radius_major = this.attribute_numeric('radius_major', 0.75);
        this.radius_minor = this.attribute_numeric('radius_minor', 0.25);
    }

    scale(): number {
        return this.centre.length() + this.radius_major + this.radius_minor;
    }
}
