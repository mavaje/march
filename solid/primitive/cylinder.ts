import {f32, struct, vec3f} from "../../byte-packing/byte-types";
import {Packer} from "../../byte-packing/packer";
import {Material} from "../../material/material";
import {Primitive} from "./primitive";
import {Vector} from "../../vector";
import {Solid} from "../solid";

export class Cylinder extends Primitive {

    static name = 'cylinder';
    static observedAttributes = [
        ...Solid.common_attributes,
        'centre',
        'direction',
        'radius',
    ];

    public packer = new Packer(struct('Cylinder', {
        centre: vec3f,
        direction: vec3f,
        radius: f32,
        material: Material.struct,
    }));

    public centre: Vector;
    public direction: Vector;
    public radius: number;

    update() {
        super.update();
        this.centre = this.attribute_vector('centre', Vector.vectors.origin);
        this.direction = this.attribute_vector('direction', Vector.vectors.up, true);
        this.radius = this.attribute_numeric('radius', 1);
    }

    scale(): number {
        return this.centre.length() + this.radius;
    }
}
