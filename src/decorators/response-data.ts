import InjectParams from "../services/inject-params";
import {RESPONSE_DATA} from "../constants/metadata-keys";

/**
 *
 * @param expression
 * @param useClass
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function ResponseData(): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {

            InjectParams.build(RESPONSE_DATA, {
                propertyKey,
                parameterIndex,
                target,
                useConverter: false
            });

        }

    };
}