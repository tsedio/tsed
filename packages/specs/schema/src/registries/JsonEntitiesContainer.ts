import {classOf, decoratorTypeOf, DecoratorTypes, descriptorOf, prototypeOf, Store, type Type} from "@tsed/core";

import type {JsonClassStore, JsonMethodStore, JsonParameterStore, JsonPropertyStore} from "../components/index.js";
import type {JsonEntityStore} from "../domain/JsonEntityStore.js";

/**
 * @ignore
 */
const stores = new Map<DecoratorTypes, Type<JsonEntityStore>>();

export function defineStore(type: DecoratorTypes, store: Type<JsonEntityStore>) {
  stores.set(type, store);
  return store;
}

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
  if (args[0].isStore) {
    return args[0] as T;
  }

  const target = args[0];

  if (args.length > 1) {
    args[0] = prototypeOf(args[0]);
  }

  const store = Store.from(...args);

  if (!store.has("JsonEntityStore")) {
    const decoratorType = decoratorTypeOf(args);
    const entityStore = stores.get(decoratorType)!;

    const jsonSchemaStore = new entityStore({
      store,
      decoratorType,
      target: classOf(target),
      propertyKey: args[1],
      index: typeof args[2] === "number" ? args[2] : undefined,
      descriptor: typeof args[2] === "object" ? args[2] : undefined
    });

    jsonSchemaStore.build();

    store.set("JsonEntityStore", jsonSchemaStore);
  }

  return store.get<T>("JsonEntityStore")!;
}

export function getJsonMethodStore<T extends JsonMethodStore = JsonMethodStore>(target: any, propertyKey: string | symbol) {
  const proto = prototypeOf(target);

  return getJsonEntityStore<T>(proto, propertyKey, descriptorOf(proto, propertyKey));
}
