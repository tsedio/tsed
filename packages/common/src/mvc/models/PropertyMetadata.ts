import {DecoratorTypes, prototypeOf, Type} from "@tsed/core";
import {alterIgnore, getJsonSchema, getPropertiesStores, JsonEntityComponent, JsonEntityStore} from "@tsed/schema";
import {mapAllowedRequiredValues} from "../utils/mapAllowedRequiredValues";

@JsonEntityComponent(DecoratorTypes.PROP)
export class PropertyMetadata extends JsonEntityStore {
  get ignoreProperty(): boolean {
    return alterIgnore(this.itemSchema, {});
  }

  set ignoreProperty(ignore: boolean) {
    this.itemSchema.ignore(ignore);
  }

  /**
   * Return the required state.
   * @returns {boolean}
   */
  get required(): boolean {
    return this.parent.schema.isRequired(this.propertyKey as string);
  }

  /**
   * Change the state of the required data.
   * @param value
   */
  set required(value: boolean) {
    if (value) {
      this.parent.schema.addRequired(this.propertyKey as string);
    } else {
      this.parent.schema.removeRequired(this.propertyKey as string);
    }
  }

  get allowedRequiredValues() {
    const schema = getJsonSchema(this._target, {useAlias: false}).properties[this.propertyName];
    const type: string | string[] = schema.type || "";

    return mapAllowedRequiredValues(type, schema);
  }

  static get(target: Type<any>, propertyKey: string | symbol) {
    return JsonEntityStore.from<PropertyMetadata>(prototypeOf(target), propertyKey);
  }

  static getProperties(target: Type<any>, options: Partial<{withIgnoredProps: boolean}> = {}) {
    const stores = getPropertiesStores<PropertyMetadata>(target);

    stores.forEach((store, key) => {
      if (!options.withIgnoredProps) {
        if (alterIgnore(store.itemSchema, {})) {
          stores.delete(key);
        }
      }
    });

    return stores;
  }

  /**
   * Check precondition between value, required and allowedRequiredValues to know if the entity is required.
   * @param value
   * @returns {boolean}
   */
  isRequired(value: any): boolean {
    return this.required && [undefined, null, ""].includes(value) && !this.allowedRequiredValues.includes(value);
  }
}
