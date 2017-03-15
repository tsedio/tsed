
import {EXPRESS_RESPONSE} from "../constants/metadata-keys";
import InjectParams from "../services/inject-params";

/**
 * Response service.
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function Response(): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            const injectParams = InjectParams.get(target, propertyKey, parameterIndex);

            injectParams.service = EXPRESS_RESPONSE;

            InjectParams.set(target, propertyKey, parameterIndex, injectParams);

        }
    };
}