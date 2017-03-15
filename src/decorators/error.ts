import InjectParams from "../services/inject-params";
import {EXPRESS_ERR} from "../constants/metadata-keys";

/**
 *
 * @returns {Function}
 * @constructor
 */
export function Err(): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            const injectParams = InjectParams.get(target, propertyKey, parameterIndex);

            injectParams.service = EXPRESS_ERR;

            InjectParams.set(target, propertyKey, parameterIndex, injectParams);
        }
    };
}
