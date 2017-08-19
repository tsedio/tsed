/**
 * @module common/mvc
 */ /** */

import {PropertyRegistry} from "../../converters/registries/PropertyRegistry";
import {Type} from "../../core/interfaces";
import {ParamRegistry} from "../registries/ParamRegistry";
import {EndpointRegistry} from "../registries/EndpointRegistry";
/**
 * Add required annotation for a function argument .
 * @returns {Function}
 * @decorator
 */
export function Required(): any {

    return (target: Type<any>, propertyKey: string, parameterIndex: number): void => {

        EndpointRegistry
            .get(target, propertyKey)
            .store
            .merge("responses", {"400": {description: "Bad request"}});

        if (typeof parameterIndex === "number") {
            ParamRegistry.required(target, propertyKey, parameterIndex);
        } else {
            PropertyRegistry.required(target, propertyKey);
        }

    };

}