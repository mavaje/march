import {StructType} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {MarchComponent} from "../march-component";
import {Material} from "../material/material";

export abstract class Solid extends MarchComponent {

    protected packer: Packer<StructType>;

    static name: string;
    static common_attributes = ['material', 'smoothing'];

    public index: number;

    name() {
        return this.constructor.name;
    }

    struct() {
        return this.packer.type;
    }

    get material(): Material {
        const material = this.attribute_reference('material', Material);
        if (material) return material;

        const colour = this.attribute_colour('material');
        if (colour) {
            return Material.of_colour(colour);
        }

        if (this.parentElement instanceof Solid) {
            return this.parentElement.material;
        } else {
            return new Material();
        }
    }

    get smoothing(): number {
        const smoothing = this.attribute_numeric('smoothing', null);
        if (smoothing !== null) return smoothing;

        if (this.parentElement instanceof Solid) {
            return this.parentElement.smoothing;
        } else {
            return 0;
        }
    }

    buffer() {
        this.packer.set(this);

        return this.packer.buffer;
    }

    abstract scale(): number;

    abstract hit_code(origin?: string): string;
}
