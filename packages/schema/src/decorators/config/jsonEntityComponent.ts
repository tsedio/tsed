import {DecoratorTypes, Type} from "@tsed/core";
import {JsonEntityStore} from "../../domain/JsonEntityStore";

export function JsonEntityComponent(type: DecoratorTypes) {
  return (target: Type<JsonEntityStore>) => {
    JsonEntityStore.entities.set(type, target);
  };
}
