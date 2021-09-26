import {DecoratorTypes, prototypeOf, Type} from "@tsed/core";
import {JsonEntityComponent, JsonEntityStore} from "@tsed/schema";

@JsonEntityComponent(DecoratorTypes.PROP)
export class PropertyMetadata extends JsonEntityStore {
  static get(target: Type<any>, propertyKey: string | symbol) {
    return JsonEntityStore.from<PropertyMetadata>(prototypeOf(target), propertyKey);
  }
}
