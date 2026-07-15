import {nameOf, Type} from "@tsed/core";

import {getJsonEntityStore} from "./JsonEntitiesContainer.js";

/**
 * Lazy reference to a schema type for handling circular dependencies.
 *
 * JsonLazyRef provides a deferred reference mechanism for types that may not be
 * available at decoration time due to circular dependencies or forward references.
 * The actual type is resolved lazily when needed, avoiding initialization order issues.
 *
 * ### Usage
 *
 * ```typescript
 * class User {
 *   @Property()
 *   name: string;
 *
 *   // Circular reference - user has a manager who is also a user
 *   @Property()
 *   manager: User; // Internally uses lazy ref
 * }
 * ```
 *
 * ### Use Cases
 *
 * - **Circular Dependencies**: Classes that reference themselves or each other
 * - **Forward References**: References to classes defined later in the file
 * - **Conditional Imports**: Types that may not be available immediately
 *
 * ### How It Works
 *
 * The lazy ref wraps a function that returns the type, delaying type resolution
 * until the schema is actually needed during schema generation.
 *
 * @public
 */
export class JsonLazyRef {
  readonly isLazyRef = true;

  constructor(readonly getType: () => Type<any>) {}

  get target() {
    return this.getType();
  }

  get schema() {
    return getJsonEntityStore(this.getType()).schema;
  }

  get name() {
    return nameOf(this.getType());
  }
}
