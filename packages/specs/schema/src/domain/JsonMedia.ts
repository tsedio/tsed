import {OS3MediaType} from "@tsed/openspec";

import {JsonMap} from "./JsonMap.js";
import {JsonSchema} from "./JsonSchema.js";

export class JsonMedia extends JsonMap<OS3MediaType<JsonSchema>> {
  $kind: string = "operationMedia";

  groups: string[] = [];
  groupsName: string;
  allowedGroups?: Set<string>;

  schema(schema: JsonSchema) {
    this.set("schema", schema);

    return this;
  }

  examples(examples: any) {
    this.set("examples", examples);

    return this;
  }
}
