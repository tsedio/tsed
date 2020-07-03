import {ancestorsOf, Type} from "@tsed/core";
import {JsonEntityStore} from "../domain/JsonEntityStore";
import {getJsonEntityStore} from "./getJsonEntityStore";

/**
 * Return store and his inherited stores
 * @param target
 */
export function getInheritedStores(target: Type<any> | any): Map<Type<any>, JsonEntityStore> {
  const store: any = target.isStore ? target : getJsonEntityStore(target);

  if (!store.$inherited) {
    store.$inherited = ancestorsOf(store.target)
      .reverse()
      .reduce((context, model) => {
        return context.set(model, getJsonEntityStore(model));
      }, new Map());
  }

  return store.$inherited;
}
