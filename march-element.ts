import {Vector, VectorLike} from "./vector";

export abstract class MarchElement extends HTMLElement {

    attribute_numeric(name: string, fallback: number = 0) {
        let value = Number.parseFloat(this.getAttribute(name));
        return isNaN(value) ? fallback : value;
    }

    attribute_vector(name: string, fallback: VectorLike = [0, 0, 0], normalised: boolean = false) {
        const vector = Vector.from_string(this.getAttribute(name), fallback);
        return normalised ? vector.normalised() : vector;
    }
}
