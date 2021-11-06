import {decoratorTypeOf, Store} from "@tsed/core";
import type {JsonEntityStore} from "../domain/JsonEntityStore";
import {JsonEntitiesContainer} from "../registries/JsonEntitiesContainer";

/**
 * @ignore
 */
export function isJsonEntityStore(model: any): model is JsonEntityStore {
  return model.isStore;
}

/**
 * @ignore
 */
export function getJsonEntityStore<T extends JsonEntityStore = JsonEntityStore>(...args: any[]) {
  if (isJsonEntityStore(args[0])) {
    return args[0];
  }

  const store = Store.from(...args);

  if (!store.has("JsonEntityStore")) {
    const entityStore = JsonEntitiesContainer.get(decoratorTypeOf(args)) || JsonEntitiesContainer.get("default");

    const jsonSchemaStore = new (entityStore as any)({
      store,
      target: args[0],
      propertyKey: args[1],
      index: typeof args[2] === "number" ? args[2] : undefined,
      descriptor: typeof args[2] === "object" ? args[2] : undefined
    });

    store.set("JsonEntityStore", jsonSchemaStore);
  }

  return store.get<T>("JsonEntityStore")!;
}
