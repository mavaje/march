import {MarchComponent} from "../march-component";
import {struct, vec3f} from "../byte-packing/byte-types";
import {Vector} from "../vector";

export class Camera extends MarchComponent {

    static name = 'camera';
    static observedAttributes = [
        'origin',
        'direction',
        'up',
    ];

    static struct = struct('Camera', {
        origin: vec3f,
        direction: vec3f,
        up: vec3f,
    });

    public origin: Vector = Vector.from([1, 1, 1]);
    public direction: Vector = Vector.from([-1, -1, -1]).normalised();
    public up: Vector = Vector.from([0, 1, 0]).normalised();

    update() {
        super.update();
        this.origin = this.attribute_vector('origin', [1, 1, 1]);
        this.direction = this.attribute_vector('direction', this.origin.negative(), true);
        this.up = this.attribute_vector('up', [0, 1, 0], true);
    }
}
