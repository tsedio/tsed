import {Type} from "@tsed/core";

import {JsonSchema} from "../domain/JsonSchema.js";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";

export type GenericValue = Type<any> | JsonSchema | String | Number | Boolean | Object | Date;
export type GenericsMap = Record<string, [GenericValue] | [GenericValue, GenericsMap]>;

export function getGenericsOptions(value: JsonSchema, options: JsonSchemaOptions) {
  const generics = value.getGenericOf();

  return {generics: generics || options.generics, mapper: generics ? "schema" : "class"};
}
