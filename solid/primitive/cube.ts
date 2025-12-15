import {f32, struct, vec3f} from "../../byte-packing/byte-types";
import {Packer} from "../../byte-packing/packer";
import {Material} from "../../material/material";
import {Primitive} from "./primitive";
import {Vector} from "../../vector";
import {Solid} from "../solid";

export class Cube extends Primitive {

    static name = 'cube';
    static observedAttributes = [
        ...Solid.common_attributes,
        'centre',
        'size',
    ];

    public packer = new Packer(struct('Cube', {
        centre: vec3f,
        size: vec3f,
        smoothing: f32,
        material: Material.struct,
    }));

    public centre: Vector;
    public size: Vector;

    update() {
        super.update();
        this.centre = this.attribute_vector('centre', Vector.vectors.origin);
        this.size = this.attribute_vector('size', [1, 1, 1]);
    }

    scale(): number {
        return this.centre.length() + this.size.length() / 2;
    }
}
