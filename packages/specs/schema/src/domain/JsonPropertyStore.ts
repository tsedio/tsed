import {DecoratorTypes, isClass, Metadata, prototypeOf, Type} from "@tsed/core";

import {JsonEntityComponent} from "../decorators/config/jsonEntityComponent.js";
import type {JsonClassStore} from "./JsonClassStore.js";
import {JsonEntityStore} from "./JsonEntityStore.js";
import {JsonSchema} from "./JsonSchema.js";

@JsonEntityComponent(DecoratorTypes.PROP)
export class JsonPropertyStore extends JsonEntityStore {
  readonly parent: JsonClassStore = JsonEntityStore.from(this.target);

  static get(target: Type<any>, propertyKey: string | symbol) {
    return JsonEntityStore.from<JsonPropertyStore>(prototypeOf(target), propertyKey);
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

      if (this.isCollection) {
        schema = JsonSchema.from({
          type: this.collectionType
        });
        schema.itemSchema(this.type);
      } else if (isClass(this.type)) {
        schema = JsonSchema.from({type: "object"});
        schema.itemSchema(this.type);
      } else {
        schema = JsonSchema.from({type: this.type});
      }
    }

    this.parent.schema.addProperty(this.propertyName, schema);

    this._schema = schema;
  }
}

/**
 * @alias JsonPropertyStore
 */
export type PropertyMetadata = JsonPropertyStore;
export const PropertyMetadata = JsonPropertyStore;
