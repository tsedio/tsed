import type {Type} from "@tsed/core";

import type {JsonMapperMethods} from "../interfaces/JsonMapperMethods.js";
/**
 * @ignore
 */
// tslint:disable-next-line:variable-name
const JsonMapperTypesContainer: Map<Type<any> | Symbol | string, JsonMapperMethods> = new Map();
/**
 * @ignore
 */
export function registerJsonTypeMapper(type: Type<any> | Symbol | string, token: Type<JsonMapperMethods>) {
  JsonMapperTypesContainer.set(type, new token());
}
/**
 * @ignore
 */
export function getJsonMapperTypes(): Map<Type<any> | Symbol | string, JsonMapperMethods> {
  return JsonMapperTypesContainer;
}
