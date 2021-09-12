import {DecoratorTypes, prototypeOf, Type} from "@tsed/core";
import {getProperties, JsonEntityComponent, JsonEntityStore} from "@tsed/schema";

@JsonEntityComponent(DecoratorTypes.PROP)
export class PropertyMetadata extends JsonEntityStore {
  static get(target: Type<any>, propertyKey: string | symbol) {
    return JsonEntityStore.from<PropertyMetadata>(prototypeOf(target), propertyKey);
  }

  /**
   * @deprecated Since 2020-11-11. Use getProperties from @tsed/schema
   */
  static getProperties(target: Type<any>, options: Partial<{withIgnoredProps: boolean}> = {}) {
    return getProperties(target, options);
  }
}
