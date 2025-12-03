import {f32, struct, vec3f} from "../../byte-packing/byte-types";
import {Packer} from "../../byte-packing/packer";
import {Solid} from "../solid";

export abstract class Composite extends Solid {

    static name = 'composite';
    static observedAttributes = [
        ...Solid.common_attributes,
        'smoothing',
    ];

    public packer = new Packer(struct('Composite', {
        smoothing: f32,
        unused: vec3f,
    }));

    public smoothing: number;

    update() {
        super.update();
        this.smoothing = this.attribute_numeric('smoothing', 0);
    }

    child_solids() {
        return [...this.children]
            .filter(child => child instanceof Solid) as Solid[];
    }

    scale(): number {
        return Math.max(
            ...this.child_solids().map(solid => solid.scale()),
        );
    }

    hit_code(origin = 'origin'): string {
        const child_solids = this.child_solids();

        if (child_solids.length < 1) {
            return 'Hit()';
        }

        let code: string = null;
        child_solids.forEach(solid => {
            if (code) {
                code = `${this.function_name()}(${code}, ${solid.hit_code(origin)}, ${this.name()}_list[${this.index}].smoothing)`;
            } else {
                code = solid.hit_code(origin);
            }
        });
        return code;
    }

    abstract function_name(): string;
}
