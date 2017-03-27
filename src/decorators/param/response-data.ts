import {RESPONSE_DATA} from "../../constants/metadata-keys";
import EndpointParam from "../../controllers/endpoint-param";
import {Type} from "../../interfaces/interfaces";

/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function ResponseData(): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {

            EndpointParam.useService(RESPONSE_DATA, {
                propertyKey,
                parameterIndex,
                target
            });

        }

    };
}