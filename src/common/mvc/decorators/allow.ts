import {Type} from "@tsed/core";
import {ParamRegistry} from "../../filters/registries/ParamRegistry";
import {JsonSchema} from "../../jsonschema/class/JsonSchema";
import {PropertyRegistry} from "../../jsonschema/registries/PropertyRegistry";
import {decoratorSchemaFactory} from "../../jsonschema/utils/decoratorSchemaFactory";

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
  const allowNullInSchema = decoratorSchemaFactory((schema: JsonSchema) => {
    if (schema && schema.mapper) {
      if (schema.mapper.$ref) {
        schema.mapper.oneOf = [{type: "null"}, {$ref: schema.mapper.$ref}];
        delete schema.mapper.$ref;
      } else {
        schema.mapper.type = [].concat(schema.type, ["null"] as any);
      }
    }
  });

  return (target: Type<any>, propertyKey: string, parameterIndex?: number): void => {
    if (typeof parameterIndex === "number") {
      const paramMetadata = ParamRegistry.get(target, propertyKey, parameterIndex);
      paramMetadata.allowedRequiredValues = allowedRequiredValues;

      ParamRegistry.set(target, propertyKey, parameterIndex, paramMetadata);
    } else {
      const propertyMetadata = PropertyRegistry.get(target, propertyKey);
      propertyMetadata.allowedRequiredValues = allowedRequiredValues;

      PropertyRegistry.set(target, propertyKey, propertyMetadata);

      if (allowedRequiredValues.some(e => e == null)) {
        allowNullInSchema(target, propertyKey);
      }
    }
  };
}
