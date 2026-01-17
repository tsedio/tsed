import {Type} from "@tsed/core";

import {JsonMapperMethods} from "../interfaces/JsonMapperMethods.js";
/**
 * @ignore
 */
// tslint:disable-next-line:variable-name
const JsonMapperTypesContainer: Map<Type<any> | Symbol | string, JsonMapperMethods> = new Map();
/**
 * Register a mapper class for a specific primitive/complex type so it can be reused by the serializers.
 */
export function registerJsonTypeMapper(type: Type<any> | Symbol | string, token: Type<JsonMapperMethods>) {
  JsonMapperTypesContainer.set(type, new token());
}

/**
 * Retrieve the registry of custom JSON mapper instances keyed by the types they support.
 */
export function getJsonMapperTypes(): Map<Type<any> | Symbol | string, JsonMapperMethods> {
  return JsonMapperTypesContainer;
}
