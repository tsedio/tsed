/**
 * @module core
 */
/** */

export function Configurable(value: boolean = true): Function {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor = {writable: true, enumerable: true}) => {
        descriptor.configurable = value;
        return descriptor;
    };
}

export function NotConfigurable(): Function {
    return Configurable(false);
}