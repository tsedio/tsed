/**
 * @module common/mvc
 */
/** */

import {PropertyRegistry} from "../../converters/registries/PropertyRegistry";
import {Type} from "../../core/interfaces";
import {ParamRegistry} from "../registries/ParamRegistry";

/**
 * Add allowed values when the property or parameters is required `@Required()`.
 * @returns {Function}
 * @decorator
 */
export function Allow(...allowedValues: any[]): any {

    return (target: Type<any>, propertyKey: string, parameterIndex?: number): void => {

        if (typeof parameterIndex === "number") {
            const paramMetadata = ParamRegistry.get(target, propertyKey, parameterIndex);
            paramMetadata.allowedValues = allowedValues;

            ParamRegistry.set(target, propertyKey, parameterIndex, paramMetadata);
        } else {
            const propertyMetadata = PropertyRegistry.get(target, propertyKey);
            propertyMetadata.allowedValues = allowedValues;

            PropertyRegistry.set(target, propertyKey, propertyMetadata);
        }

    };
}