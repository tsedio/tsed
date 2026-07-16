import {OS3MediaType, OS3RequestBody, OpenSpecHash} from "@tsed/openspec";
import {JsonMap} from "./JsonMap.js";
import {JsonSchema} from "./JsonSchema.js";
import {toJsonMapCollection} from "../utils/toJsonMapCollection.js";

/**
 * Configuration options for HTTP request body definitions compatible with OpenAPI 3.
 *
 * @public
 */
export type JsonRequestBodyOptions = OS3RequestBody<JsonSchema>;

/**
 * Represents an HTTP request body definition for OpenAPI specifications.
 *
 * JsonRequestBody defines the structure and content types accepted by an HTTP
 * operation's request body. It provides a fluent API for specifying request
 * body schemas, media types, and examples.
 *
 * ### Usage
 *
 * ```typescript
 * const requestBody = new JsonRequestBody()
 *   .description("User creation payload")
 *   .addContent("application/json", userSchema, {
 *     example1: {name: "John", email: "john@example.com"}
 *   });
 * ```
 *
 * ### Key Features
 *
 * - **Content Types**: Support for multiple media types (JSON, XML, form data, etc.)
 * - **Schema Integration**: JSON schemas for request validation
 * - **Examples**: Request body examples for documentation
 * - **Required Flag**: Mark request body as required or optional
 *
 * @public
 */
export class JsonRequestBody extends JsonMap<JsonRequestBodyOptions> {
  $kind = "operationRequestBody";

  constructor(obj: Partial<JsonRequestBodyOptions> = {}) {
    super(obj);

    this.content(obj.content || ({} as any));
  }

  description(description: string): this {
    this.set("description", description);

    return this;
  }

  content(content: OpenSpecHash<OS3MediaType<JsonSchema>>) {
    this.set("content", toJsonMapCollection(content));

    return this;
  }

  addContent(mediaType: string, schema: JsonSchema, examples?: any) {
    const content = this.get("content");
    const mediaContent = new JsonMap();

    mediaContent.set("schema", schema);
    examples && mediaContent.set("examples", examples);

    content.set(mediaType, mediaContent);

    return this;
  }

  required(required: boolean): this {
    this.set("required", required);

    return this;
  }
}
