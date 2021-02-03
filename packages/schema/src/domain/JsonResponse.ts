import {cleanObject, HashOf} from "@tsed/core";
import {OS3MediaType, OS3Response} from "@tsed/openspec";
import {JsonHeader, JsonSchemaOptions} from "../interfaces";
import {mapHeaders} from "../utils/mapHeaders";
import {toJsonMapCollection} from "../utils/toJsonMapCollection";
import {JsonMap} from "./JsonMap";
import {JsonSchema} from "./JsonSchema";
import {SpecTypes} from "./SpecTypes";

export type JsonResponseOptions = OS3Response<JsonSchema, string | JsonHeader>;

export class JsonMedia extends JsonMap<OS3MediaType<JsonSchema>> {
  groups: string[];

  schema(schema: JsonSchema) {
    this.set("schema", schema);

    return this;
  }

  examples(examples: any) {
    this.set("examples", examples);

    return this;
  }

  toJSON(options: JsonSchemaOptions = {}): any {
    return super.toJSON({...options, groups: this.groups});
  }
}

export class JsonResponse extends JsonMap<JsonResponseOptions> {
  status: number;

  constructor(obj: Partial<JsonResponseOptions> = {}) {
    super(obj);

    this.content(obj.content || ({} as any));
  }

  description(description: string): this {
    this.set("description", description);

    return this;
  }

  headers(headers: HashOf<string | JsonHeader>): this {
    this.set("headers", mapHeaders(headers));

    return this;
  }

  content(content: HashOf<OS3MediaType<JsonSchema>>) {
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

  toJSON(options: JsonSchemaOptions = {}): any {
    const response = super.toJSON(options);

    if (this.status === 204) {
      delete response.content;
    }

    if (options.specType !== SpecTypes.OPENAPI && response.content) {
      const key = Object.keys(response.content)[0];

      return cleanObject({
        ...response,
        ...response.content[key],
        content: undefined
      });
    }

    return response;
  }
}
