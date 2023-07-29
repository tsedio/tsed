import {OpenSpecHash, OS3MediaType, OS3RequestBody} from "@tsed/openspec";
import {toJsonMapCollection} from "../utils/toJsonMapCollection";
import {JsonMap} from "./JsonMap";
import {JsonSchema} from "./JsonSchema";

export type JsonRequestBodyOptions = OS3RequestBody<JsonSchema>;

export class JsonRequestBody extends JsonMap<JsonRequestBodyOptions> {
  kind = "operationRequestBody";

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
