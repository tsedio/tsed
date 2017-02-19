
export function Deprecated(message: string) {

    return (target: any, targetKey: string, descriptor) => {

        const originalMethod = descriptor.value;

        descriptor.value = require('util').deprecate(originalMethod, message);

        return descriptor;
    }

}