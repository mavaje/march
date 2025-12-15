export type ColourLike = [number, number, number] | DOMPoint;

export class Colour extends DOMPoint {

    constructor(
        r: number = 0,
        g: number = 0,
        b: number = 0,
        a: number = 1,
    ) {
        super(r, g, b, a);
    }

    static greyscale(value: number = 0.5): Colour {
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
        colour ??= '';

        const test_element = document.body.appendChild(document.createElement('div'));
        test_element.style.color = colour;
        const rgb_string = getComputedStyle(test_element).color;
        test_element.remove();

        const match = /rgba?\((?<r>\d+),\s*(?<g>\d+),\s*(?<b>\d+)(,\s*(?<a>[\d.]+))?\)/.exec(rgb_string);
        if (match) {
            const {r, g, b, a = '1'} = match.groups;
            return new Colour(
                Number.parseInt(r) / 255,
                Number.parseInt(g) / 255,
                Number.parseInt(b) / 255,
                Number.parseFloat(a),
            );
        }

        return new Colour();
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
    get a() { return this.w; }

    set r(r: number) { this.x = r; }
    set g(g: number) { this.y = g; }
    set b(b: number) { this.z = b; }
    set a(a: number) { this.w = a; }

    invert(): Colour {
        return new Colour(
            1 - this.r,
            1 - this.g,
            1 - this.b,
            this.a,
        );
    }

    scale(amount: number): Colour {
        return new Colour(
            this.r * amount,
            this.g * amount,
            this.b * amount,
            this.a,
        );
    }

    darken(amount: number = 0.5): Colour {
        return this.scale(1 - amount);
    }

    lighten(amount: number = 0.5): Colour {
        return this.invert().scale(1 - amount).invert();
    }
}
