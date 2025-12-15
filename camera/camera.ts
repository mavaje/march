import {MarchComponent} from "../march-component";
import {struct, vec2f, vec3f} from "../byte-packing/byte-types";
import {Vector} from "../vector";

export class Camera extends MarchComponent {

    static name = 'camera';
    static observedAttributes = [
        'origin',
        'direction',
        'up',
        'width',
        'height',
    ];

    static struct = struct('Camera', {
        origin: vec3f,
        direction: vec3f,
        up: vec3f,
        size: vec2f,
    });

    public origin: Vector = Vector.from([1, 1, 1]);
    public direction: Vector = Vector.from([-1, -1, -1]).normalised();
    public up: Vector = Vector.vectors.up;
    public width: number = 1;
    public height: number = 1;

    update() {
        super.update();
        this.origin = this.attribute_vector('origin', [1, 1, 1]);
        this.direction = this.attribute_vector('direction', this.origin.negative(), true);
        this.up = this.attribute_vector('up', Vector.vectors.up, true);
        this.width = this.attribute_numeric('width', 1);
        this.height = this.attribute_numeric('height', 1);
    }

    get size() {
        return Vector.from([
            this.width,
            this.height,
            0,
        ]);
    }
}
