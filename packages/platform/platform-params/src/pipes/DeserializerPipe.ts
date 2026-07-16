import {JsonParameterStore, PipeMethods} from "@tsed/schema";
import {deserialize} from "@tsed/json-mapper";
import {injectable} from "@tsed/di";

export class DeserializerPipe implements PipeMethods {
  transform(value: any, param: JsonParameterStore) {
    return deserialize(value, {
      useAlias: true,
      store: param,
      ...(param.store.get(DeserializerPipe) || {})
    });
  }
}

injectable(DeserializerPipe);
