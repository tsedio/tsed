import {popGenerics} from "@tsed/schema";
import {JsonHeader, JsonMediaType, JsonSerializerOptions} from "../interfaces";
import {serializeItem} from "../utils/serializeJsonSchema";
import {toJsonMapCollection} from "../utils/toJsonMapCollection";
import {JsonMap} from "./JsonMap";
import {JsonSchema} from "./JsonSchema";
import {SpecTypes} from "./SpecTypes";

export interface JsonResponseOptions {
  description: string;
  headers: {[header: string]: JsonHeader};
  content: {
    [media: string]: JsonSchema;
  };
  links: {[link: string]: any};
}

export class JsonResponse extends JsonMap<JsonResponseOptions> {
  $schema: JsonSchema;

  constructor(obj: Partial<JsonResponseOptions> = {}) {
    super(obj);

    this.content(obj.content || ({} as any));
  }

  schema(schema: JsonSchema) {
    this.$schema = schema;

    return this;
  }

  description(description: string): this {
    this.set("description", description);

    return this;
  }

  content(content: {[media: string]: JsonMediaType}) {
    this.set("content", toJsonMapCollection(content));

    return this;
  }

  addContent(mediaType: string, schema?: JsonSchema) {
    const content = this.get("content");
    const mediaContent = new JsonMap();

    mediaContent.set("schema", schema);

    content.set(mediaType, mediaContent);

    return this;
  }

  toJSON(options: JsonSerializerOptions = {}): any {
    const response = super.toJSON(options);

    if (options.spec !== SpecTypes.OPENAPI) {
      delete response.content;

      response.schema = serializeItem(this.$schema, options);
    }

    return response;
  }
}
