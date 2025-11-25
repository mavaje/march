import {f32, struct, vec3f} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Solid} from "./solid";

export enum CompositeOperation {
    Union = 0,
    Intersection = 1,
    Difference = 2,
}

export class Composite extends Solid {

    static name = 'composite';

    constructor(
        public solid_a: Solid = null,
        public solid_b: Solid = null,
        public operation: CompositeOperation = CompositeOperation.Union,
        public smoothing: number = 0,
    ) {
        super();

        this.packer = new Packer(struct({
            smoothing: f32,
            unused: vec3f,
        }));
    }

    static union(solid_a: Solid, solid_b: Solid, smoothing?: number) {
        return new Composite(solid_a, solid_b, CompositeOperation.Union, smoothing);
    }

    static intersection(solid_a: Solid, solid_b: Solid, smoothing?: number) {
        return new Composite(solid_a, solid_b, CompositeOperation.Intersection, smoothing);
    }

    static difference(solid_a: Solid, solid_b: Solid, smoothing?: number) {
        return new Composite(solid_a, solid_b, CompositeOperation.Difference, smoothing);
    }

    hit_code(): string {
        return `smooth_${
            CompositeOperation[this.operation].toLowerCase()
        }(${
            this.solid_a.hit_code()
        }, ${
            this.solid_b.hit_code()
        }, composite_list[${ this.index }].smoothing)`;
    }
}
