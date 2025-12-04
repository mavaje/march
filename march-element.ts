import {Vector, VectorLike} from "./vector";
import {Colour, ColourLike} from "./colour";

export abstract class MarchElement extends HTMLElement {

    attribute_numeric(name: string, fallback: number = 0): number {
        let value = Number.parseFloat(this.getAttribute(name));
        return isNaN(value) ? fallback : value;
    }

    attribute_vector(name: string, fallback?: VectorLike, normalised: boolean = false): Vector {
        const vector = Vector.from_string(this.getAttribute(name), fallback);
        return normalised ? vector.normalised() : vector;
    }

    attribute_colour(name: string, fallback?: ColourLike): Colour {
        return this.hasAttribute(name)
            ? Colour.from_string(this.getAttribute(name))
            : Colour.from(fallback);
    }

    attribute_reference<T extends typeof HTMLElement>(name: string, type: T): InstanceType<T> {
        const attribute = this.getAttribute(name);
        const match = /url\(#(?<id>.+)\)/.exec(attribute);
        if (match) {
            const element = document.getElementById(match.groups.id);
            if (element instanceof type) {
                return element as InstanceType<T>;
            }
        }
        return null;
    }
}
