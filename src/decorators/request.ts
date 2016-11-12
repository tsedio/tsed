import {EXPRESS_REQUEST} from "../constants/metadata-keys";
import InjectParams from "../metadata/inject-params";

/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function Request(): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {

            const injectParams = InjectParams.get(target, propertyKey, parameterIndex);

            injectParams.service = EXPRESS_REQUEST;

            InjectParams.set(target, propertyKey, parameterIndex, injectParams);

        }
    };
}