import {StructType} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {MarchComponent} from "../march-component";

export abstract class Solid extends MarchComponent {

    protected packer: Packer<StructType>;

    static name: string;

    public index: number;

    name() {
        return this.constructor.name;
    }

    struct() {
        return this.packer.type;
    }

    buffer() {
        this.packer.set(this);

        return this.packer.buffer;
    }

    hit_code(): string {
        const name = this.name();
        return `hit_${name}(origin, ${name}_list[${this.index}])`;
    }
}
