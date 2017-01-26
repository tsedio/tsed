import InjectParams from "../services/inject-params";
import {ENDPOINT_INFO} from "../constants/metadata-keys";
/**
 *
 * @param expression
 * @param useClass
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function EndpointInfo(): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {

            InjectParams.build(ENDPOINT_INFO, {
                propertyKey,
                parameterIndex,
                target
            });

        }

    };
}