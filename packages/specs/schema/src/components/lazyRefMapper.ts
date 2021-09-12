import {JsonLazyRef} from "../domain/JsonLazyRef";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions";
import {registerJsonSchemaMapper} from "../registries/JsonSchemaMapperContainer";
import {mapGenericsOptions} from "../utils/generics";
import {createRef, toRef} from "../utils/ref";

export function lazyRefMapper(input: JsonLazyRef, options: JsonSchemaOptions) {
  const name = input.name;

  if (options.$refs?.find((t: any) => t === input.target)) {
    return createRef(name, input.schema, options);
  }

  options.$refs = [...(options.$refs || []), input.target];

  const schema = input.toJSON(mapGenericsOptions(options));

  return toRef(input.schema, schema, options);
}

registerJsonSchemaMapper("lazyRef", lazyRefMapper);
