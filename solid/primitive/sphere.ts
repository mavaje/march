import {f32, struct, vec3f} from "../../byte-packing/byte-types";
import {Packer} from "../../byte-packing/packer";
import {Material} from "../../material/material";
import {Primitive} from "./primitive";
import {Vector} from "../../vector";
import {Solid} from "../solid";

export class Sphere extends Primitive {

    static name = 'sphere';
    static observedAttributes = [
        ...Solid.observedAttributes,
        'centre',
        'radius',
    ];

    public packer = new Packer(struct('Sphere', {
        centre: vec3f,
        radius: f32,
        material: Material.struct,
    }));

    public centre: Vector;
    public radius: number;

    update() {
        super.update();
        this.centre = this.attribute_vector('centre', [0, 0, 0]);
        this.radius = this.attribute_numeric('radius', 1);
    }
}
