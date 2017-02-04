
import InjectorService from "../services/injector";
import Metadata from "../services/metadata";

export function Inject(): Function {

    return (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<Function>): TypedPropertyDescriptor<Function> => {

        // save a reference to the original method this way we keep the values currently in the
        // descriptor and don't overwrite what another decorator might have done to the descriptor.
        /* istanbul ignore next */
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, targetKey);
        }

        const originalMethod = descriptor.value;

        descriptor.value = function(locals: Map<Function, string> = new Map<Function, string>()) {

            /* istanbul ignore next */
            if (locals instanceof Map === false) {
                locals = new Map();
            }

            return InjectorService.invokeMethod(originalMethod.bind(this), {
                target,
                methodName: targetKey,
                locals
            });
        };

        (descriptor.value as any).$injected = true;

        return descriptor;
    };
}
