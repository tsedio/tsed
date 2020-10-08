import {OpenSpecHash, OS3MediaType, OS3Response} from "@tsed/openspec";
import {JsonHeader, JsonSchemaOptions} from "../interfaces";
import {mapHeaders} from "../utils/mapHeaders";
import {serializeItem} from "../utils/serializeJsonSchema";
import {toJsonMapCollection} from "../utils/toJsonMapCollection";
import {JsonMap} from "./JsonMap";
import {JsonSchema} from "./JsonSchema";
import {SpecTypes} from "./SpecTypes";

export type JsonResponseOptions = OS3Response<JsonSchema, string | JsonHeader>;

export class JsonResponse extends JsonMap<JsonResponseOptions> {
  $schema: JsonSchema;

  constructor(obj: Partial<JsonResponseOptions> = {}) {
    super(obj);

    this.content(obj.content || ({} as any));
  }

  description(description: string): this {
    this.set("description", description);

    return this;
  }

  headers(headers: OpenSpecHash<string | JsonHeader>): this {
    this.set("headers", mapHeaders(headers));

    return this;
  }

  content(content: OpenSpecHash<OS3MediaType<JsonSchema>>) {
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

  toJSON(options: JsonSchemaOptions = {}): any {
    const response = super.toJSON(options);

    if (options.spec !== SpecTypes.OPENAPI) {
      delete response.content;

      response.schema = serializeItem(this.$schema, options);
    }

    return response;
  }
}
