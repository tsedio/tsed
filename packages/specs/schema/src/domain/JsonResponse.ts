import {OS3MediaType, OS3Response} from "@tsed/openspec";

import {JsonHeader} from "../interfaces/JsonOpenSpec.js";
import {mapHeaders} from "../utils/mapHeaders.js";
import {toJsonMapCollection} from "../utils/toJsonMapCollection.js";
import {JsonMap} from "./JsonMap.js";
import {JsonMedia} from "./JsonMedia.js";
import {JsonSchema} from "./JsonSchema.js";

/**
 * Configuration options for HTTP response definitions compatible with OpenAPI 3.
 *
 * @public
 */
export type JsonResponseOptions = OS3Response<JsonSchema, string | JsonHeader>;

/**
 * Represents an HTTP response definition for OpenAPI specifications.
 *
 * JsonResponse defines the structure of an HTTP response including status code,
 * description, headers, and content types. It provides a fluent API for building
 * response metadata compatible with OpenAPI 3 specifications.
 *
 * ### Usage
 *
 * ```typescript
 * const response = new JsonResponse()
 *   .description("User created successfully")
 *   .headers({"X-Rate-Limit": "100"})
 *   .content({
 *     "application/json": {
 *       schema: userSchema
 *     }
 *   });
 * ```
 *
 * ### Key Features
 *
 * - **Status Codes**: Associated HTTP status code
 * - **Headers**: Response header definitions
 * - **Content Types**: Multiple media type support
 * - **Schema Integration**: JSON schemas for response bodies
 *
 * @public
 */
export class JsonResponse extends JsonMap<JsonResponseOptions> {
  $kind: string = "operationResponse";
  status = 200;

  constructor(obj: Partial<JsonResponseOptions> = {}) {
    super(obj);

    this.content(obj.content || ({} as any));
  }

  description(description: string): this {
    this.set("description", description);

    return this;
  }

  headers(headers: Record<string, string | JsonHeader>): this {
    this.set("headers", mapHeaders(headers));

    return this;
  }

  content(content: Record<string, OS3MediaType<JsonSchema>>) {
    this.set("content", toJsonMapCollection(content, JsonMedia));

    return this;
  }

  getContent(): JsonMap<JsonMedia> {
    return this.get("content")!;
  }

  getMedia(mediaType: string, create = true): JsonMedia {
    create && this.addMedia(mediaType);

    return this.getContent()?.get(mediaType) as any;
  }

  addMedia(mediaType: string) {
    const content = this.get("content");

    if (!content.has(mediaType)) {
      content.set(mediaType, new JsonMedia());
    }

    return this;
  }

  isBinary() {
    return this.getContent().has("application/octet-stream");
  }
}
