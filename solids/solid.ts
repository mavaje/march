import {StructType} from "../byte-packing/byte-types";
import {Packer} from "../byte-packing/packer";
import {Material} from "./material";

export abstract class Solid {

    protected packer: Packer<StructType>;

    static name: string;

    public index: number;

    protected constructor(
        public material: Material = new Material(),
    ) {}

    with_material(material: Material) {
        this.material = material;
        return this;
    }

    name() {
        return this.constructor.name.toLowerCase();
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
