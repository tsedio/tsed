import {OS3MediaType, OS3Response} from "@tsed/openspec";

import {JsonHeader} from "../interfaces/JsonOpenSpec.js";
import {mapHeaders} from "../utils/mapHeaders.js";
import {toJsonMapCollection} from "../utils/toJsonMapCollection.js";
import {JsonMap} from "./JsonMap.js";
import {JsonMedia} from "./JsonMedia.js";
import {JsonSchema} from "./JsonSchema.js";

export type JsonResponseOptions = OS3Response<JsonSchema, string | JsonHeader>;

export class JsonResponse extends JsonMap<JsonResponseOptions> {
  $kind: string = "operationResponse";

  status: number;

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
