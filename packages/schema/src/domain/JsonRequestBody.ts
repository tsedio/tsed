import {JsonMediaType} from "../interfaces";
import {toJsonMapCollection} from "../utils/toJsonMapCollection";
import {JsonMap} from "./JsonMap";
import {JsonSchema} from "./JsonSchema";

export interface JsonRequestBodyOptions {
  description?: string;
  content: {
    [media: string]: JsonSchema;
  };
  required?: boolean;
}

export class JsonRequestBody extends JsonMap<JsonRequestBodyOptions> {
  constructor(obj: Partial<JsonRequestBodyOptions> = {}) {
    super(obj);

    this.content(obj.content || ({} as any));
  }

  description(description: string): this {
    this.set("description", description);

    return this;
  }

  content(content: {[media: string]: JsonMediaType}) {
    this.set("content", toJsonMapCollection(content));

    return this;
  }

  addContent(mediaType: string, schema: JsonSchema) {
    const content = this.get("content");
    const mediaContent = new JsonMap();

    mediaContent.set("schema", schema);

    content.set(mediaType, mediaContent);

    return this;
  }

  required(required: boolean): this {
    this.set("required", required);

    return this;
  }
}
