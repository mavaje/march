
export type VectorLike = [number, number, number] | DOMPoint;

export class Vector extends DOMPoint {

    static vectors = {
        origin: new Vector(0, 0, 0),
        right: new Vector(1, 0, 0),
        left: new Vector(-1, 0, 0),
        up: new Vector(0, 1, 0),
        down: new Vector(0, -1, 0),
        out: new Vector(0, 0, 1),
        in: new Vector(0, 0, -1),
    } as const;

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

        if (vector in Vector.vectors) {
            return Vector.vectors[vector];
        }

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

    static from_angular(azimuth: number, altitude: number): Vector {
        return new Vector(
            Math.cos(altitude) * Math.sin(azimuth),
            Math.sin(altitude),
            Math.cos(altitude) * Math.cos(azimuth),
        );
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

    angular(): [number, number] {
        return [
            Math.atan2(this.x, this.z),
            Math.asin(this.y),
        ];
    }

    rotate_x(angle: number): Vector {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        return new Vector(
            this.x,
            this.y * cos - this.z * sin,
            this.z * cos + this.y * sin,
        );
    }

    rotate_y(angle: number): Vector {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        return new Vector(
            this.x * cos + this.z * sin,
            this.y,
            this.z * cos - this.x * sin,
        );
    }

    rotate_z(angle: number): Vector {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        return new Vector(
            this.x * cos - this.y * sin,
            this.y * cos + this.x * sin,
            this.z,
        );
    }
}
