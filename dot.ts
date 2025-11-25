
export function dot_has(object: object, dot_key: string): boolean {
    return dot_key.split('.').reduce(
        (o, k, i, {length}) =>
            i < length - 1
                ? (o[k] ??= /^\d+$/.test(k) ? [] : {})
                : (k in o),
        object,
    );
}

export function dot_read(object: object, dot_key: string): any {
    return dot_key.split('.').reduce(
        (o, k) => o?.[k],
        object,
    );
}

export function dot_assign<T extends any>(object: object, dot_key: string, value: T): T {
    return dot_key.split('.').reduce(
        (o, k, i, {length}) =>
            i < length - 1
                ? (o[k] ??= /^\d+$/.test(k) ? [] : {})
                : (o[k] = value),
        object,
    );
}
