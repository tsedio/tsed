import {JsonLazyRef} from "../../domain/JsonLazyRef";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer";
import {mapGenericsOptions} from "../../utils/generics";
import {createRef, toRef} from "../../utils/ref";

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
