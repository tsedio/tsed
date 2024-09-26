import type {Type} from "@tsed/core";
import {Store} from "@tsed/core";
import {JsonEntityStore} from "@tsed/schema";

export function isEndpoint(target: Type<any>, propertyKey: string | symbol) {
  return Store.fromMethod(target, propertyKey).has(JsonEntityStore);
}
