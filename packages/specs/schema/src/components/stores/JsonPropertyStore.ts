import {DecoratorTypes, Metadata, isClass, prototypeOf} from "@tsed/core";
import {defineStore, getJsonEntityStore} from "../../registries/JsonEntitiesContainer.js";
import type {JsonClassStore} from "./JsonClassStore.js";
import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {JsonSchema} from "../../domain/JsonSchema.js";

/**
 * Store for property metadata and schema information.
 *
 * JsonPropertyStore manages metadata for class properties decorated with schema decorators
 * like `@Property()`, `@Required()`, `@MinLength()`, etc. It handles schema generation,
 * type resolution, and integration with the parent class schema.
 *
 * ### Responsibilities
 *
 * - **Schema Generation**: Creates and maintains the JsonSchema for the property
 * - **Type Resolution**: Resolves property types including primitives, classes, and collections
 * - **Parent Integration**: Registers the property schema with the parent class schema
 * - **Collection Handling**: Special handling for arrays, Sets, Maps, and other collections
 *
 * ### Usage
 *
 * ```typescript
 * // Get property store
 * const propertyStore = JsonPropertyStore.get(MyClass, "propertyName");
 *
 * // Access property schema
 * const schema = propertyStore.schema;
 *
 * // Check property type
 * const type = propertyStore.type;
 * const isCollection = propertyStore.isCollection;
 * ```
 *
 * ### Schema Integration
 *
 * When a property is decorated, this store:
 * 1. Resolves the property's TypeScript type
 * 2. Creates an appropriate JsonSchema
 * 3. Registers it in the parent class's `properties` object
 * 4. Handles collection item schemas for arrays/collections
 *
 * ### Type Handling
 *
 * - **Primitives**: Creates schema with appropriate type (string, number, boolean, etc.)
 * - **Classes**: Creates object schema with reference to the class schema
 * - **Collections**: Creates array schema with item type schema
 *
 * @public
 */
export class JsonPropertyStore extends JsonEntityStore {
  readonly parent: JsonClassStore = getJsonEntityStore(this.target);

  build() {
    if (!this._type) {
      this.buildType(Metadata.getType(prototypeOf(this.target), this.propertyKey));
    }

    this._type = this._type || Object;

    const properties = this.parent.schema.get("properties");

    let schema: JsonSchema = properties[this.propertyName];

    if (!schema) {
      this.parent.children.set(this.propertyName, this);

      if (this.isCollection) {
        schema = new JsonSchema({
          type: this.collectionType
        });
        schema.itemSchema(this.type);
      } else if (isClass(this.type)) {
        schema = new JsonSchema({type: "object"});
        schema.itemSchema(this.type);
      } else {
        schema = new JsonSchema({type: this.type});
      }
    }

    this.parent.schema.addProperty(this.propertyName, schema);

    this._schema = schema;
  }
}

/**
 * @alias JsonPropertyStore
 * @deprecated
 */
export type PropertyMetadata = JsonPropertyStore;
/**
 * @alias JsonPropertyStore
 * @deprecated
 */
export const PropertyMetadata = JsonPropertyStore;

defineStore(DecoratorTypes.PROP, JsonPropertyStore);
