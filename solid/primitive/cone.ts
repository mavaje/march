import {f32, struct, vec3f} from "../../byte-packing/byte-types";
import {Packer} from "../../byte-packing/packer";
import {Material} from "../../material/material";
import {Primitive} from "./primitive";
import {Vector} from "../../vector";
import {Solid} from "../solid";

export class Cone extends Primitive {

    static name = 'cone';
    static observedAttributes = [
        ...Solid.common_attributes,
        'angle',
        'centre',
    ];

    public packer = new Packer(struct('Cone', {
        centre: vec3f,
        sin: f32,
        cos: f32,
        material: Material.struct,
    }));

    public angle: number;
    public centre: Vector;

    update() {
        super.update();
        this.angle = this.attribute_numeric('angle', Math.PI / 4,);
        this.centre = this.attribute_vector('centre', [0, 0, 0]);
    }

    get sin() {
        return Math.sin(this.angle);
    }

    get cos() {
        return Math.cos(this.angle);
    }

    scale(): number {
        return this.centre.length();
    }
}
