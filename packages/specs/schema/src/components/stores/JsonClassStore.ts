import {DecoratorTypes} from "@tsed/core";

import {JsonEntityStore, JsonSchema} from "../../domain/index.js";
import {defineStore} from "../../registries/JsonEntitiesContainer.js";
import type {JsonMethodStore} from "./JsonMethodStore.js";
import type {JsonPropertyStore} from "./JsonPropertyStore.js";

/**
 * Store for class-level metadata and schema information.
 *
 * JsonClassStore manages metadata for classes decorated with schema decorators like
 * `@Model()`, `@Generics()`, `@DiscriminatorKey()`, etc. It serves as the root container
 * for all class-level schema information and coordinates child stores for properties
 * and methods.
 *
 * ### Responsibilities
 *
 * - **Schema Generation**: Creates and maintains the JsonSchema for the class
 * - **Children Coordination**: Manages child PropertyStore and MethodStore instances
 * - **Route Configuration**: Stores base path for controller classes
 * - **Inheritance**: Handles schema inheritance from parent classes
 * - **OpenAPI Integration**: Generates component schemas for OpenAPI specifications
 *
 * ### Usage
 *
 * ```typescript
 * // Get class store
 * const classStore = s.store(MyClass);
 *
 * // Access class schema
 * const schema = s.get(MyClass);
 *
 * // Get all properties
 * const properties = classStore.children;
 *
 * // Check if it's a controller with a path
 * const path = classStore.path;
 * ```
 *
 * ### Class Store Hierarchy
 *
 * The class store acts as the root of the store hierarchy:
 * ```
 * JsonClassStore (User class)
 * ├─ JsonPropertyStore (name property)
 * ├─ JsonPropertyStore (email property)
 * └─ JsonMethodStore (validate method)
 *    ├─ JsonParameterStore (param 0)
 *    └─ JsonParameterStore (param 1)
 * ```
 *
 * ### Schema Structure
 *
 * For a class like:
 * ```typescript
 * class User {
 *   @Property()
 *   name: string;
 *
 *   @Property()
 *   email: string;
 * }
 * ```
 *
 * The class store generates:
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "name": {"type": "string"},
 *     "email": {"type": "string"}
 *   }
 * }
 * ```
 *
 * ### Controller Path
 *
 * For controller classes decorated with `@Controller("/users")`, the store
 * maintains the base path which is used for route generation.
 *
 * @public
 */
export class JsonClassStore extends JsonEntityStore {
  /**
   * List of children JsonEntityStore (properties or methods or params)
   */
  readonly children: Map<string | number, JsonMethodStore | JsonPropertyStore> = new Map();

  get path() {
    return this.store.get("path", "/");
  }

  set path(path: string) {
    this.store.set("path", path);
  }

  build() {
    if (!this._type) {
      this.buildType(this.target);
    }

    this._type = this._type || Object;

    this._schema = new JsonSchema({
      type: this.type
    });
  }
}

defineStore(DecoratorTypes.CLASS, JsonClassStore);
