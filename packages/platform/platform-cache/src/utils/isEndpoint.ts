import {Store, Type} from "@tsed/core";
import {JsonEntityStore} from "@tsed/schema";

export function isEndpoint(target: Type<any>, propertyKey: string | symbol) {
  return Store.fromMethod(target, propertyKey).has(JsonEntityStore);
}
