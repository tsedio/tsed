import {ENDPOINT_INFO} from "../../constants/metadata-keys";
import EndpointParam from "../../controllers/endpoint-param";
import {Type} from "../../interfaces/interfaces";
/**
 *
 * @returns {Function}
 * @constructor
 */
export function EndpointInfo(): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useService(ENDPOINT_INFO, {
                propertyKey,
                parameterIndex,
                target
            });

        }

    };
}