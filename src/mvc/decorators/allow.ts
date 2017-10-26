import {PropertyRegistry} from "../../jsonschema/registries/PropertyRegistry";
import {Type} from "../../core/interfaces";
import {ParamRegistry} from "../../filters/registries/ParamRegistry";

/**
 * Add allowed values when the property or parameters is required.
 *
 * #### Example on parameter:
 *
 * ```typescript
 * @Post("/")
 * async method(@Required() @Allow("") @BodyParams("field") field: string) {}
 * ```
 * > Required will throw a BadRequest when the given value is `null` or `undefined` but not for an empty string.
 *
 * #### Example on model:
 *
 * ```typescript
 * class Model {
 *   @JsonProperty()
 *   @Required()
 *   @Allow("")
 *   field: string;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 */
export function Allow(...allowedRequiredValues: any[]): any {

    return (target: Type<any>, propertyKey: string, parameterIndex?: number): void => {

        if (typeof parameterIndex === "number") {
            const paramMetadata = ParamRegistry.get(target, propertyKey, parameterIndex);
            paramMetadata.allowedRequiredValues = allowedRequiredValues;

            ParamRegistry.set(target, propertyKey, parameterIndex, paramMetadata);
        } else {
            const propertyMetadata = PropertyRegistry.get(target, propertyKey);
            propertyMetadata.allowedRequiredValues = allowedRequiredValues;

            PropertyRegistry.set(target, propertyKey, propertyMetadata);
        }

    };
}