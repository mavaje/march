import {Solid} from "../solid";

export abstract class Primitive extends Solid {
    hit_code(origin = 'origin'): string {
        const name = this.name();
        return `hit_${name}(${origin}, ${name}_list[${this.index}])`;
    }
}
