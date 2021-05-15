import {Type} from "@tsed/core";
import {JsonMapperMethods} from "../interfaces/JsonMapperMethods";
/**
 * @ignore
 */
// tslint:disable-next-line:variable-name
const JsonMapperTypesContainer: Map<Type<any> | Symbol, JsonMapperMethods> = new Map();
/**
 * @ignore
 */
export function registerJsonTypeMapper(type: Type<any>, token: Type<JsonMapperMethods>) {
  JsonMapperTypesContainer.set(type, new token());
}
/**
 * @ignore
 */
export function getJsonMapperTypes(): WeakMap<Type<any> | Symbol, JsonMapperMethods> {
  return JsonMapperTypesContainer;
}
