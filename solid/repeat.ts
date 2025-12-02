import {struct, vec3f} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Vector} from "../vector";
import {Solid} from "./solid";

export class Repeat extends Solid {

    static name = 'repeat';
    static observedAttributes = [
        ...Solid.observedAttributes,
        'start',
        'end',
        'step',
    ];

    public packer = new Packer(struct('Repeat', {
        start: vec3f,
        end: vec3f,
        step: vec3f,
    }));

    public start: Vector;
    public step: Vector;
    public end: Vector;

    child(): Solid {
        return [...this.children]
            .filter(child => child instanceof Solid)[0] as Solid;
    }

    update() {
        super.update();
        this.start = this.attribute_vector('start', [0, 0, 0]);
        this.end = this.attribute_vector('end', [0, 0, 0]);
        this.step = this.attribute_vector('step', [1, 1, 1]);
    }

    hit_code(origin = 'origin'): string {
        const child = this.child();
        return child
            ? child.hit_code(`repeat_origin(${origin}, repeat_list[${this.index}])`)
            : 'Hit()';
    }
}
