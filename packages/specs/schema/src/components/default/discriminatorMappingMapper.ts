import {isString} from "@tsed/core";
import {JsonSchema} from "../../domain/JsonSchema.js";
import {SpecTypes} from "../../domain/SpecTypes.js";
import type {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";
import {toRef} from "../../utils/ref.js";

interface SchemaWithDiscriminator {
  discriminator?: {mapping?: Record<string, JsonSchema | string>};
}

export function discriminatorMappingMapper(obj: SchemaWithDiscriminator, _: JsonSchema, options: JsonSchemaOptions) {
  if (obj.discriminator?.mapping) {
    const entries = Object.entries(obj.discriminator.mapping);
    const newMapping: Record<string, string> = {};

    for (const [key, value] of entries) {
      newMapping[key] = isString(value) ? value : toRef(value, null, options).$ref;
    }

    obj.discriminator.mapping = newMapping;
  }

  return obj;
}

function defaultDiscriminatorMappingMapper(obj: SchemaWithDiscriminator) {
  if (obj.discriminator?.mapping) {
    delete obj.discriminator.mapping;
  }

  return obj;
}


registerJsonSchemaMapper("discriminatorMapping", defaultDiscriminatorMappingMapper);

