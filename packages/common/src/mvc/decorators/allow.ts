import {DecoratorParameters, getDecoratorType, UnsupportedDecoratorType} from "@tsed/core";
import {JsonSchema} from "../../jsonschema/class/JsonSchema";
import {decoratorSchemaFactory} from "../../jsonschema/utils/decoratorSchemaFactory";
import {getStorableMetadata} from "./utils/getStorableMetadata";

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
 *   @Property()
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

  return (...decoratorArgs: DecoratorParameters): void => {
    const metadata = getStorableMetadata(decoratorArgs);

    if (!metadata) {
      throw new UnsupportedDecoratorType(Allow, decoratorArgs);
    }

    metadata.allowedRequiredValues = allowedRequiredValues;

    if (getDecoratorType(decoratorArgs, true) === "property" && allowedRequiredValues.some(e => e == null)) {
      allowNullInSchema(decoratorArgs[0], decoratorArgs[1]);
    }
  };
}
