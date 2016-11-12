import InjectParams from "../metadata/inject-params";
import {EXPRESS_NEXT_FN} from "../constants/metadata-keys";

/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function Next(): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {

            const injectParams = InjectParams.get(target, propertyKey, parameterIndex);

            injectParams.service = EXPRESS_NEXT_FN;

            InjectParams.set(target, propertyKey, parameterIndex, injectParams);
        }
    };
}
