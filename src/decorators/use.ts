import * as Controllers from "../controllers/controllers";
/**
 * Use decorator.
 * @returns {function(any, any, any): *}
 * @constructor
 * @param args
 */
export function Use(...args: any[]): Function {

    return <T> (
        targetClass: Function,
        methodClassName: string,
        descriptor: TypedPropertyDescriptor<T>
    ) : TypedPropertyDescriptor<T> => {

        Controllers.setEndpoint(targetClass, methodClassName, args);

        return descriptor;
    };
}