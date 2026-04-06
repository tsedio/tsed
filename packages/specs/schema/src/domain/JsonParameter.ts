import {OpenSpecHash, OpenSpecRef, OS3Example, OS3Parameter} from "@tsed/openspec";

import {Partial} from "../decorators/operations/partial.js";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";
import {execMapper} from "../registries/JsonSchemaMapperContainer.js";
import {JsonMap} from "./JsonMap.js";
import {formatParameterType} from "./JsonParameterTypes.js";
import {JsonSchema} from "./JsonSchema.js";

/**
 * Represents an HTTP operation parameter for OpenAPI specifications.
 *
 * JsonParameter defines a single parameter for an HTTP operation, supporting
 * various parameter locations (path, query, header, body, files) and providing
 * a fluent API for building parameter metadata compatible with OpenAPI 3.
 *
 * ### Parameter Types
 *
 * - **path**: Parameter in the URL path (e.g., `/users/{id}`)
 * - **query**: Query string parameter (e.g., `?page=1`)
 * - **header**: HTTP header parameter
 * - **body**: Request body parameter
 * - **files**: File upload parameter
 *
 * ### Usage
 *
 * ```typescript
 * const param = new JsonParameter()
 *   .name("userId")
 *   .in("path")
 *   .required(true)
 *   .description("The user identifier")
 *   .schema(JsonSchema.from(String));
 * ```
 *
 * ### Key Features
 *
 * - **Schema Integration**: Associated JSON schema for validation
 * - **Examples**: Support for parameter examples
 * - **Expression**: Custom parameter expressions for complex bindings
 * - **Validation**: Required/optional flags and schema constraints
 *
 * @public
 */
export class JsonParameter extends JsonMap<OS3Parameter<JsonSchema>> {
  $kind = "operationInParameter";
  expression = "";

  constructor(obj: Partial<OS3Parameter<JsonSchema>> = {}) {
    super(obj);
    if (!this.has("schema")) {
      this.set("schema", new JsonSchema());
    }
  }

  getName() {
    const name = this.get("name");

    if (this.get("in") === "files") {
      return name.split(".")[0];
    }

    return name;
  }

  name(name: string): this {
    this.set("name", name);

    return this;
  }

  examples(examples: OpenSpecHash<OS3Example | OpenSpecRef>) {
    super.set("examples", examples);

    return this;
  }

  description(description: string): this {
    this.set("description", description);

    return this;
  }

  in(inType: string, expression: string | any = ""): this {
    this.set("in", formatParameterType(inType));
    this.expression = expression;

    return this;
  }

  required(required: boolean): this {
    this.set("required", required);

    return this;
  }

  public schema(): JsonSchema;
  public schema(schema: JsonSchema): this;
  public schema(schema?: JsonSchema): JsonSchema | this {
    if (schema) {
      this.set("schema", schema);
      return this;
    }

    return this.get("schema");
  }

  itemSchema(schema?: JsonSchema) {
    if (this.schema().isCollection) {
      schema && this.schema().itemSchema(schema);

      return this.schema().itemSchema();
    }

    schema && this.schema(schema);
    // non-collection: delegate to the main schema
    return this.schema();
  }

  toJSON(options?: JsonSchemaOptions) {
    return execMapper("operationInParameter", [this], options);
  }
}
