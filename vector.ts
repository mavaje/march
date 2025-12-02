export type VectorLike = [number, number, number] | DOMPoint;

export class Vector extends DOMPoint {

    constructor(
        x: number = 0,
        y: number = 0,
        z: number = 0,
    ) {
        super(x, y, z);
    }

    static from(vector: VectorLike): Vector {
        if (vector instanceof Vector) {
            return vector;
        }

        if (vector instanceof DOMPoint) {
            return new Vector(vector.x, vector.y, vector.z);
        }

        if (Array.isArray(vector)) {
            return new Vector(...vector);
        }
    }

    static from_string(vector: string, fallback: VectorLike = [0, 0, 0]): Vector {
        vector ??= '';
        const values = vector
            .split(/[^-\d.]/g)
            .map(Number.parseFloat)
            .filter(v => !isNaN(v));
        if (values.length === 0) {
            return Vector.from(fallback);
        } else if (values.length === 1) {
            return Vector.from([values[0], values[0], values[0]]);
        } else {
            return Vector.from(values as VectorLike);
        }
    }

    length(): number {
        return Math.sqrt(
            this.x ** 2 +
            this.y ** 2 +
            this.z ** 2
        );
    }

    scaled(scale: number): Vector {
        return new Vector(
            this.x * scale,
            this.y * scale,
            this.z * scale,
        );
    }

    negative(): Vector {
        return this.scaled(-1);
    }

    normalised(): Vector {
        return this.scaled(1 / this.length());
    }
}
