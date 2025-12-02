import {StructType} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {MarchComponent} from "../march-component";
import {Material} from "../material/material";

export abstract class Solid extends MarchComponent {

    protected packer: Packer<StructType>;

    static name: string;
    static observedAttributes = ['material'];

    public index: number;

    name() {
        return this.constructor.name;
    }

    struct() {
        return this.packer.type;
    }

    find_material(): Material {
        const material = this.attribute_reference('material', Material);
        if (material) return material;

        if (this.parentElement instanceof Solid) {
            return this.parentElement.find_material();
        } else {
            return new Material();
        }
    }

    buffer() {
        this.packer.set(this);

        return this.packer.buffer;
    }

    abstract hit_code(origin?: string): string;
}
