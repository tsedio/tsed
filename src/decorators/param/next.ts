import {EXPRESS_NEXT_FN} from "../../constants/metadata-keys";
import EndpointParam from "../../controllers/endpoint-param";
import {Type} from "../../interfaces/interfaces";

/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function Next(): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useService(EXPRESS_NEXT_FN, {
                target,
                propertyKey,
                parameterIndex
            });

        }
    };
}
