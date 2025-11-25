import { f32, struct, vec3f } from "../byte-packing/byte-types";
import { Packer } from "../byte-packing/packer";
import { Solid } from "./solid";
export var CompositeOperation;
(function (CompositeOperation) {
    CompositeOperation[CompositeOperation["Union"] = 0] = "Union";
    CompositeOperation[CompositeOperation["Intersection"] = 1] = "Intersection";
    CompositeOperation[CompositeOperation["Difference"] = 2] = "Difference";
})(CompositeOperation || (CompositeOperation = {}));
export class Composite extends Solid {
    solid_a;
    solid_b;
    operation;
    smoothing;
    static name = 'composite';
    constructor(solid_a = null, solid_b = null, operation = CompositeOperation.Union, smoothing = 0) {
        super();
        this.solid_a = solid_a;
        this.solid_b = solid_b;
        this.operation = operation;
        this.smoothing = smoothing;
        this.packer = new Packer(struct({
            smoothing: f32,
            unused: vec3f,
        }));
    }
    static union(solid_a, solid_b, smoothing) {
        return new Composite(solid_a, solid_b, CompositeOperation.Union, smoothing);
    }
    static intersection(solid_a, solid_b, smoothing) {
        return new Composite(solid_a, solid_b, CompositeOperation.Intersection, smoothing);
    }
    static difference(solid_a, solid_b, smoothing) {
        return new Composite(solid_a, solid_b, CompositeOperation.Difference, smoothing);
    }
    hit_code() {
        return `smooth_${CompositeOperation[this.operation].toLowerCase()}(${this.solid_a.hit_code()}, ${this.solid_b.hit_code()}, composite_list[${this.index}].smoothing)`;
    }
}
