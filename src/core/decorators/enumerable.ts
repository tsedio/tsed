/**
 * @module core
 */
/** */

export function Enumerable(value: boolean = true): Function {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor = {
        writable: true,
        configurable: true
    }) => {
        descriptor.enumerable = value;
        return descriptor;
    };
}

export function NotEnumerable(): Function {
    return Enumerable(false);
}