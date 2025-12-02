import {Solid} from "../solid";

export class Primitive extends Solid {
    buffer() {
        this.packer.set('material', this.find_material());

        return super.buffer();
    }

    hit_code(origin = 'origin'): string {
        const name = this.name();
        return `hit_${name}(${origin}, ${name}_list[${this.index}])`;
    }
}
