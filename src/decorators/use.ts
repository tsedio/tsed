import Controller from "../controllers/controller";
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



        //Controller.setEndpoint(targetClass, methodClassName, args);

        return descriptor;
    };
}