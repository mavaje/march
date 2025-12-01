import {f32, struct, vec3f} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Solid} from "./solid";

export abstract class Composite extends Solid {

    static name = 'composite';
    static observedAttributes = ['smoothing'];

    public smoothing: number;

    constructor() {
        super();

        this.packer = new Packer(struct('Composite', {
            smoothing: f32,
            unused: vec3f,
        }));
    }

    update() {
        this.smoothing = this.attribute_numeric('smoothing', 0);
    }

    child_solids() {
        return [...this.children]
            .filter(child => child instanceof Solid) as Solid[];
    }

    hit_code(): string {
        const child_solids = this.child_solids();

        if (child_solids.length < 1) {
            return 'Hit()';
        }

        let code: string = null;
        child_solids.forEach(solid => {
            if (code) {
                code = `${this.function_name()}(${code}, ${solid.hit_code()}, ${this.name()}_list[${this.index}].smoothing)`;
            } else {
                code = solid.hit_code();
            }
        });
        return code;
    }

    abstract function_name(): string;
}
