import {ByteType} from "./byte-types";

export class Packer<T extends ByteType> {

    protected i32s: Int32Array;
    protected u32s: Uint32Array;
    protected f32s: Float32Array;

    constructor(
        public type: T,
        public buffer = new ArrayBuffer(type.size),
    ) {
        this.i32s = new Int32Array(this.buffer);
        this.u32s = new Uint32Array(this.buffer);
        this.f32s = new Float32Array(this.buffer);
    }

    private array_for_type(type: ByteType): Int32Array | Uint32Array | Float32Array {
        switch (type.name) {
            case 'i32':
                return this.i32s;
            case 'bool':
            case 'u32':
                return this.u32s;
            case 'f32':
                return this.f32s;
            case 'vec':
                return this.array_for_type(type.vec_type);
            case 'mat':
                return this.array_for_type(type.mat_type);
            case 'array':
                return this.array_for_type(type.array_type);
            default:
                throw new Error(`Can't directly get type ${this.type.name}`);
        }
    }

    set(value: boolean|number|number[]|DOMPoint|DOMMatrix, offset?: number): void;
    set(key: string, value: boolean|number|number[]|DOMPoint|DOMMatrix): void;
    set(...args: any[]): void {
        let value: number[];
        let type: ByteType = this.type;
        let offset: number;
        let array: Int32Array | Uint32Array | Float32Array;

        if (type.name === 'struct' && typeof args[0] === 'string') {
            let key: string;
            [key, value] = args;
            offset = type.struct_offsets[key] / 4;
            type = type.struct_members[key];
            array = this.array_for_type(type);
        } else {
            [value, offset = 0] = args;
            array = this.array_for_type(this.type);
        }

        if (type.name === 'vec' && value instanceof DOMPoint) {
            value = [value.x, value.y, value.z, value.w].slice(0, type.vec_size);
        }

        if (type.name === 'mat' && value instanceof DOMMatrix) {
            if (type.mat_size[0] === 2) {
                value = [
                    value.m11, value.m12,
                    value.m21, value.m22,
                    value.m31, value.m32,
                    value.m41, value.m42,
                ].slice(0, 2 * type.mat_size[1]);
            } else {
                value = [
                    value.m11, value.m21, value.m31, value.m41,
                    value.m12, value.m22, value.m32, value.m42,
                    value.m13, value.m23, value.m33, value.m43,
                    value.m14, value.m24, value.m34, value.m44,
                    // value.m11, value.m12, value.m13, value.m14,
                    // value.m21, value.m22, value.m23, value.m24,
                    // value.m31, value.m32, value.m33, value.m34,
                    // value.m41, value.m42, value.m43, value.m44,
                ].slice(0, type.mat_size[0] * type.mat_size[1]);
            }
        }

        if (!Array.isArray(value)) value = [value];

        array.set(value, offset);
    }

    set_struct(members: Record<string, any>) {
        if (this.type.name !== 'struct') throw new Error('Can only set struct members on structs');

        Object.keys(this.type.struct_members).forEach(key => {
            this.set(key, members[key]);
        });
    }
}
