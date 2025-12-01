import {Vector} from "./vector";

export type ColourLike = [number, number, number] | DOMPoint;

export class Colour extends Vector {

    static BLACK = Colour.grey(0);
    static WHITE = Colour.grey(1);

    constructor(
        r: number = 0,
        g: number = 0,
        b: number = 0,
    ) {
        super(r, g, b);
    }

    static grey(value: number = 0.5): Colour {
        return new Colour(value, value, value);
    }

    static from(colour: ColourLike, fallback: Colour = null): Colour {
        if (colour instanceof Colour) {
            return colour;
        }

        if (colour instanceof DOMPoint) {
            return new Colour(colour.x, colour.y, colour.z);
        }

        if (Array.isArray(colour)) {
            return new Colour(...colour);
        }

        return fallback;
    }

    static from_string(colour: string): Colour {
        colour = colour.replaceAll(/[^0-9A-F]/gi, '');
        return new Colour(
            parseInt(colour.slice(0, 2), 16) / 255,
            parseInt(colour.slice(2, 4), 16) / 255,
            parseInt(colour.slice(4, 6), 16) / 255,
        );
    }

    hex(): string {
        return [
            this.r,
            this.g,
            this.b,
        ]
            .map(v => Math.min(Math.max(Math.floor(v * 256), 0), 255))
            .map(v => v.toString(16).padStart(2, '0'))
            .reduce((hex, c) => hex + c, '#');
    }

    get r() { return this.x; }
    get g() { return this.y; }
    get b() { return this.z; }

    set r(r: number) { this.x = r; }
    set g(g: number) { this.y = g; }
    set b(b: number) { this.z = b; }

    invert(): Colour {
        return new Colour(
            1 - this.r,
            1 - this.g,
            1 - this.b,
        );
    }

    scale(amount: number): Colour {
        return new Colour(
            this.r * amount,
            this.g * amount,
            this.b * amount,
        );
    }

    darken(amount: number = 0.5): Colour {
        return this.scale(1 - amount);
    }

    lighten(amount: number = 0.5): Colour {
        return this.invert().scale(1 - amount).invert();
    }
}
