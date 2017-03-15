import {EXPRESS_REQUEST} from "../constants/metadata-keys";
import InjectParams from "../services/inject-params";

/**
 * Request service.
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function Request(): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            const injectParams = InjectParams.get(target, propertyKey, parameterIndex);

            injectParams.service = EXPRESS_REQUEST;

            InjectParams.set(target, propertyKey, parameterIndex, injectParams);

        }
    };
}