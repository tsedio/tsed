import {DecoratorTypes, Metadata, prototypeOf, Type} from "@tsed/core";

import {JsonEntityComponent} from "../decorators/config/jsonEntityComponent.js";
import type {JsonClassStore} from "./JsonClassStore.js";
import {JsonEntityStore} from "./JsonEntityStore.js";
import {JsonSchema} from "./JsonSchema.js";

@JsonEntityComponent(DecoratorTypes.PROP)
export class JsonPropertyStore extends JsonEntityStore {
  readonly parent: JsonClassStore = JsonEntityStore.from(this.target);

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
    return this.schema.$allow;
  }

  discriminatorKey() {
    this.parent.schema.discriminatorKey(String(this.propertyKey));
    this.itemSchema.isDiscriminatorKey = true;
    return this;
  }

  isDiscriminatorKey() {
    return this.itemSchema.isDiscriminatorKey;
  }

  /**
   * Check precondition between value, required and allowedRequiredValues to know if the entity is required.
   * @param value
   * @returns {boolean}
   */
  isRequired(value: any): boolean {
    return this.required && [undefined, null, ""].includes(value) && !this.allowedRequiredValues.includes(value);
  }

  protected build() {
    if (!this._type) {
      this.buildType(Metadata.getType(prototypeOf(this.target), this.propertyKey));
    }

    this._type = this._type || Object;

    const properties = this.parent.schema.get("properties");

    let schema: JsonSchema = properties[this.propertyName];

    if (!schema) {
      this.parent.children.set(this.propertyName, this);

      schema = JsonSchema.from({
        type: this.collectionType || this.type
      });

      if (this.collectionType) {
        schema.itemSchema(this.type);
      }
    }

    this.parent.schema.addProperty(this.propertyName, schema);

    this._schema = schema;
  }

  static get(target: Type<any>, propertyKey: string | symbol) {
    return JsonEntityStore.from<JsonPropertyStore>(prototypeOf(target), propertyKey);
  }
}

/**
 * @alias JsonPropertyStore
 */
export type PropertyMetadata = JsonPropertyStore;
export const PropertyMetadata = JsonPropertyStore;
