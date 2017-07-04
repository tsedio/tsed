/**
 * @module mvc
 */ /** */

import {Type} from "../../core/interfaces/Type";
import {ParamRegistry} from "../registries/ParamRegistry";
import {PropertyRegistry} from "../../converters/registries/PropertyRegistry";
/**
 * Add required annotation for a function argument .
 * @returns {Function}
 * @decorator
 */
export function Required(): any {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {
            ParamRegistry.required(target, propertyKey, parameterIndex);
        } else {
            PropertyRegistry.required(target, propertyKey);
        }

    };

}