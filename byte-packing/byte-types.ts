type ByteTypeBase = {
    readonly name: string;
    readonly size: number;
    readonly align: number;
};

export type NumericType = {
    readonly name: 'bool' | 'f16' | 'f32' | 'i32' | 'u32';
} & ByteTypeBase;

export type VecType = {
    readonly name: 'vec';
    readonly vec_size: number;
    readonly vec_type: ByteType;
} & ByteTypeBase;

export type MatType = {
    readonly name: 'mat';
    readonly mat_size: [number, number];
    readonly mat_type: ByteType;
} & ByteTypeBase;

export type ArrayType = {
    readonly name: 'array';
    readonly array_type: ByteType;
    readonly array_size: number;
} & ByteTypeBase;

export type StructType = {
    readonly name: 'struct';
    readonly struct_members: Record<string, ByteType>;
    readonly struct_offsets: Record<string, number>;
} & ByteTypeBase;

export type ByteType = NumericType
    | VecType
    | MatType
    | ArrayType
    | StructType;

export function round_up(k: number, n: number) {
    return Math.ceil(n / k) * k;
}

export const bool: ByteType = {name: 'bool', size: 4, align: 4};

export const f16: ByteType = {name: 'f16', size: 2, align: 2};

export const i32: ByteType = {name: 'i32', size: 4, align: 4};
export const u32: ByteType = {name: 'u32', size: 4, align: 4};
export const f32: ByteType = {name: 'f32', size: 4, align: 4};

export const vec2 = (type: ByteType) => vec(2, type);
export const vec3 = (type: ByteType) => vec(3, type);
export const vec4 = (type: ByteType) => vec(4, type);
function vec(n: 2 | 3 | 4, type: ByteType): VecType {
    console.assert([2, 3, 4].includes(n));
    console.assert([bool, f16, i32, u32, f32].includes(type));
    return {
        name: 'vec',
        size: type.size * n,
        align: type.align * round_up(2, n),
        vec_size: n,
        vec_type: type,
    };
}

export const vec2i = vec2(i32);
export const vec2u = vec2(u32);
export const vec2f = vec2(f32);

export const vec3i = vec3(i32);
export const vec3u = vec3(u32);
export const vec3f = vec3(f32);

export const vec4i = vec4(i32);
export const vec4u = vec4(u32);
export const vec4f = vec4(f32);

export const mat2x2 = (type: ByteType) => mat(2, 2, type);
export const mat3x2 = (type: ByteType) => mat(3, 2, type);
export const mat4x2 = (type: ByteType) => mat(4, 2, type);
export const mat2x3 = (type: ByteType) => mat(2, 3, type);
export const mat3x3 = (type: ByteType) => mat(3, 3, type);
export const mat4x3 = (type: ByteType) => mat(4, 3, type);
export const mat2x4 = (type: ByteType) => mat(2, 4, type);
export const mat3x4 = (type: ByteType) => mat(3, 4, type);
export const mat4x4 = (type: ByteType) => mat(4, 4, type);
export function mat(n: 2 | 3 | 4, m: 2 | 3 | 4, type: ByteType): MatType {
    console.assert([2, 3, 4].includes(n));
    console.assert([2, 3, 4].includes(m));
    console.assert([f16, f32].includes(type));
    return {
        name: 'mat',
        size: type.size * n * round_up(2, m),
        align: type.align * round_up(2, m),
        mat_size: [n, m],
        mat_type: type,
    };
}

export const mat2x2f = mat2x2(f32);
export const mat2x3f = mat2x3(f32);
export const mat2x4f = mat2x4(f32);
export const mat3x2f = mat3x2(f32);
export const mat3x3f = mat3x3(f32);
export const mat3x4f = mat3x4(f32);
export const mat4x2f = mat4x2(f32);
export const mat4x3f = mat4x3(f32);
export const mat4x4f = mat4x4(f32);

export function array(type: ByteType, n: number = NaN): ArrayType {
    return {
        name: 'array',
        size: n * round_up(type.align, type.size),
        align: type.align,
        array_type: type,
        array_size: n,
    };
}

export function struct(...members: ByteType[]): StructType;
export function struct(members: Record<string, ByteType>): StructType;
export function struct(...args: any): StructType {
    let members: Record<string, ByteType>;
    if ('name' in args[0] || args.length > 1) {
        members = args;
    } else {
        members = args[0];
    }
    const align = Math.max(...Object.values(members).map(m => m.align));
    const offsets: Record<string, number> = {};
    const offset: number = Object.entries(members).reduce(
        (offset, [key, member]) =>
            (offsets[key] = round_up(member.align, offset))
            + member.size,
        0,
    );
    return {
        name: 'struct',
        size: round_up(align, offset),
        align,
        // struct_members: Object.fromEntries(Object.entries(members)),
        struct_members: members,
        struct_offsets: offsets,
    };
}

export function type_name(type: ByteType): string {
    switch (type.name) {
        case 'vec':
            const vec_type = type_name(type.vec_type);
            return `vec${type.vec_size}<${vec_type}>`;
        case 'mat':
            const mat_type = type_name(type.mat_type);
            return `mat${type.mat_size.join('x')}<${mat_type}>`;
        case 'array':
            const array_type = type_name(type.array_type);
            return `array<${array_type}, ${type.array_size}>`;
        default:
            return type.name;
    }
}

export function struct_declaration(name: string, struct: StructType): string {
    return `struct ${name} {${
        Object.entries(struct.struct_members)
            .map(([key, type]) => `${key}: ${type_name(type)},`)
            .join(' ')
    } }\n`;
}
