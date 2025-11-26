import {ByteType} from "./byte-types";

export class Packer<T extends ByteType = ByteType> {
    protected members: Record<string, Packer> = {};

    constructor(
        public type: T,
        public buffer = new ArrayBuffer(type.size),
        protected offset = 0,
    ) {
        if (type.name === 'struct') {
            Object.entries(type.struct_members).forEach(([key, member]) => {
                this.members[key] = new Packer(
                    member,
                    this.buffer,
                    this.offset + type.struct_offsets[key],
                );
            });
        }
    }

    private array(type: ByteType = this.type): Int32Array | Uint32Array | Float32Array {
        switch (type.name) {
            case 'i32':
                return new Int32Array(this.buffer, this.offset);
            case 'bool':
            case 'u32':
                return new Uint32Array(this.buffer, this.offset);
            case 'f32':
                return new Float32Array(this.buffer, this.offset);
            case 'vec':
                return this.array(type.vec_type);
            case 'mat':
                return this.array(type.mat_type);
            case 'array':
                return this.array(type.array_type);
            default:
                throw new Error(`Can't directly get type ${this.type.name}`);
        }
    }

    set(value: boolean|number|object, offset?: number): void;
    set(dot_key: string, value: boolean|number|object, offset?: number): void;
    set(...args: any[]): void {
        let value: number[];
        let offset: number;

        if (typeof args[0] === 'string') {
            let dot_key: string;
            [dot_key, value, offset = 0] = args;
            const [key, ...rest_keys] = dot_key.split('.');

            if (rest_keys.length > 0) {
                this.members[key].set(rest_keys.join('.'), value, offset);
            } else {
                this.members[key].set(value, offset);
            }

            return;
        } else {
            [value, offset = 0] = args;
        }

        if (this.type.name === 'struct') {
            Object.keys(this.type.struct_members).forEach(key => {
                if (key in value) {
                    this.set(key, value[key]);
                }
            });
        } else {
            if (this.type.name === 'vec' && value instanceof DOMPoint) {
                value = [value.x, value.y, value.z, value.w].slice(0, this.type.vec_size);
            }

            if (this.type.name === 'mat' && value instanceof DOMMatrix) {
                if (this.type.mat_size[0] === 2) {
                    value = [
                        value.m11, value.m12,
                        value.m21, value.m22,
                        value.m31, value.m32,
                        value.m41, value.m42,
                    ].slice(0, 2 * this.type.mat_size[1]);
                } else {
                    value = [
                        value.m11, value.m21, value.m31, value.m41,
                        value.m12, value.m22, value.m32, value.m42,
                        value.m13, value.m23, value.m33, value.m43,
                        value.m14, value.m24, value.m34, value.m44,
                    ].slice(0, this.type.mat_size[0] * this.type.mat_size[1]);
                }
            }

            if (!Array.isArray(value)) value = [value];

            this.array().set(value, offset / 4);
        }
    }
}
