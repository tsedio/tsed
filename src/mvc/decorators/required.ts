import {PropertyRegistry} from "../../converters/registries/PropertyRegistry";
import {Type} from "../../core/interfaces";
import {EndpointRegistry} from "../registries/EndpointRegistry";
import {ParamRegistry} from "../registries/ParamRegistry";

/**
 * Add required annotation for a function argument .
 * @returns {Function}
 * @decorator
 */
export function Required(...allowedValues: any[]): any {

    return (target: Type<any>, propertyKey: string, parameterIndex: number): void => {
        if (typeof parameterIndex === "number") {
            ParamRegistry.required(target, propertyKey, parameterIndex);
        } else {
            PropertyRegistry.required(target, propertyKey, allowedValues);
        }
    };
}