/**
 * @module core
 */
/** */

export function Writable(value: boolean = true): Function {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor = {
        enumerable: true,
        configurable: true
    }) => {
        descriptor.writable = value;
        return descriptor;
    };
}

export function Readonly(): Function {
    return Writable(false);
}