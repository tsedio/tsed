import {isArray, isClass} from "@tsed/core";
import {JsonMap} from "./JsonMap.js";
import {JsonSchema} from "./JsonSchema.js";
import {OS3MediaType} from "@tsed/openspec";
import {Partial} from "../decorators/operations/partial.js";

/**
 * Represents a media type definition for HTTP request or response bodies.
 *
 * JsonMedia encapsulates the schema and examples for a specific media type
 * (e.g., "application/json", "application/xml") in OpenAPI specifications.
 * It provides methods to configure the schema and examples for the media type.
 *
 * ### Usage
 *
 * ```typescript
 * const media = new JsonMedia();
 * media.type(User);
 * media.examples({
 *   user1: {
 *     value: {name: "John", email: "john@example.com"}
 *   }
 * });
 * ```
 *
 * ### Key Features
 *
 * - **Schema Definition**: Associated JSON schema for validation
 * - **Examples**: Request/response examples for documentation
 * - **Type Handling**: Automatic schema generation from TypeScript types
 * - **Union Types**: Support for oneOf schemas with multiple types
 *
 * @public
 */
export class JsonMedia extends JsonMap<any> {
  $kind: string = "operationMedia";

  constructor(obj: Partial<OS3MediaType<JsonSchema>> = {}) {
    super(obj);
    if (!this.has("schema")) {
      this.set("schema", new JsonSchema());
    }
  }

  schema(schema?: JsonSchema) {
    schema && this.set("schema", schema);

    return this.get("schema") as JsonSchema;
  }

  examples(examples?: any) {
    examples && this.set("examples", examples);

    return this;
  }

  type(type: any) {
    if (type) {
      if (isArray(type)) {
        this.schema().oneOf(type.map((type) => ({type})));
      } else {
        if (isClass(type)) {
          this.schema().type("object");
          this.schema().itemSchema(type);
        } else {
          this.schema().type(type);
        }
      }
    }

    return this;
  }
}
