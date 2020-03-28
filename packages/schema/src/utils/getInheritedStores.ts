import {ancestorsOf, Type} from "@tsed/core";
import {JsonSchemaStore} from "../domain/JsonSchemaStore";
import {getJsonSchemaStore} from "./getJsonSchemaStore";

/**
 * Return store and his inherited stores
 * @param target
 */
export function getInheritedStores(target: Type<any> | any): Map<Type<any>, JsonSchemaStore> {
  const store: any = target.isStore ? target : getJsonSchemaStore(target);

  if (!store.$inherited) {
    store.$inherited = ancestorsOf(store.type).reduce((context, model) => {
      return context.set(model, getJsonSchemaStore(model));
    }, new Map());
  }

  return store.$inherited;
}
