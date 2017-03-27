import EndpointParam from "../controllers/endpoint-param";
import {Type} from "../interfaces/interfaces";

/**
 * Add required annotation for a function argument .
 * @returns {Function}
 */
export function Required(): any {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.required(target, propertyKey, parameterIndex);

        }

    };

}