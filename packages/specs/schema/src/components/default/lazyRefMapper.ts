import type {JsonLazyRef} from "../../domain/JsonLazyRef.js";
import type {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";
import {mapGenericsOptions} from "../../utils/generics.js";
import {createRef, toRef} from "../../utils/ref.js";

export function lazyRefMapper(jsonLazyRef: JsonLazyRef, options: JsonSchemaOptions) {
  const name = jsonLazyRef.name;

  if (options.$refs?.find((t: any) => t === jsonLazyRef.target)) {
    return createRef(name, jsonLazyRef.schema, options);
  }

  options.$refs = [...(options.$refs || []), jsonLazyRef.target];

  const schema = jsonLazyRef.getType() && execMapper("schema", [jsonLazyRef.schema], mapGenericsOptions(options));

  return toRef(jsonLazyRef.schema, schema, options);
}

registerJsonSchemaMapper("lazyRef", lazyRefMapper);
