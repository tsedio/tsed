
import InjectParams from "../services/inject-params";

/**
 * Add required annotation for a function argument .
 * @returns {Function}
 */
export function Required(): any {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            const injectParams = InjectParams.get(target, propertyKey, parameterIndex);

            injectParams.required = true;

            InjectParams.set(target, propertyKey, parameterIndex, injectParams);

        }

    };

}