import {EXPRESS_ERR} from "../../constants/metadata-keys";
import EndpointParam from "../../controllers/endpoint-param";
import {Type} from "../../interfaces/interfaces";

/**
 *
 * @returns {Function}
 * @constructor
 */
export function Err(): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useService(EXPRESS_ERR, {
                propertyKey,
                parameterIndex,
                target
            });

        }
    };
}
