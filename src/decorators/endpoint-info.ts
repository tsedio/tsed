import InjectParams from "../services/inject-params";
import {ENDPOINT_INFO} from "../constants/metadata-keys";
/**
 *
 * @returns {Function}
 * @constructor
 */
export function EndpointInfo(): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            InjectParams.build(ENDPOINT_INFO, {
                propertyKey,
                parameterIndex,
                target,
                useConverter: false
            });

        }

    };
}