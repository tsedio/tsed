import {DecoratorParameters, getDecoratorType} from "@tsed/core";
import {JsonSchema} from "../class/JsonSchema";
import {JsonSchemesRegistry} from "../registries/JsonSchemesRegistry";
import {PropertyRegistry} from "../registries/PropertyRegistry";

/**
 *
 * @param {(schema: JsonSchema, parameters: DecoratorParameters) => void} fn
 * @returns {(...parameters: any[]) => any}
 */
export function decoratorSchemaFactory(fn: (schema: JsonSchema, parameters: DecoratorParameters) => void) {
  return (...parameters: any[]): any => {
    let schema: JsonSchema;

    switch (getDecoratorType(parameters)) {
      case "property":
        schema = PropertyRegistry.get(parameters[0], parameters[1]).schema;
        break;
      case "class":
        schema = JsonSchemesRegistry.createIfNotExists(parameters[0]);
        break;
    }

    const result: any = fn(schema!, parameters as DecoratorParameters);
    if (typeof result === "function") {
      result(...parameters);
    }

    return parameters[2];
  };
}
