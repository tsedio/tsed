import {DecoratorTypes, Type} from "@tsed/core";

import {JsonClassStore} from "../domain/JsonClassStore.js";
import {JsonEntitiesContainer, JsonEntityStore} from "../domain/JsonEntityStore.js";
import {JsonMethodStore} from "../domain/JsonMethodStore.js";
import {JsonParameterStore} from "../domain/JsonParameterStore.js";
import {JsonPropertyStore} from "../domain/JsonPropertyStore.js";

JsonEntitiesContainer.set(DecoratorTypes.CLASS, JsonClassStore);
JsonEntitiesContainer.set(DecoratorTypes.PROP, JsonPropertyStore);
JsonEntitiesContainer.set(DecoratorTypes.PARAM, JsonParameterStore);
JsonEntitiesContainer.set(DecoratorTypes.METHOD, JsonMethodStore);

/**
 * Get entity store from decorator args
 * @param target
 */
export function getJsonEntityStore<T extends JsonClassStore = JsonClassStore>(target: Type<any>): T;
export function getJsonEntityStore<T extends JsonPropertyStore = JsonPropertyStore>(
  target: Type<any> | any,
  propertyKey: string | symbol
): T;
export function getJsonEntityStore<T extends JsonParameterStore = JsonParameterStore>(
  target: Type<any> | any,
  propertyKey: string | symbol,
  index: number
): T;
export function getJsonEntityStore<T extends JsonMethodStore = JsonMethodStore>(
  target: Type<any> | any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): T;
export function getJsonEntityStore<T extends JsonEntityStore = JsonEntityStore>(...args: any[]): T;
export function getJsonEntityStore<T extends JsonEntityStore = JsonEntityStore>(...args: any[]): T {
  return JsonEntityStore.from<T>(...args);
}
