import {Injectable, injectable} from "@tsed/di";
import {deserialize} from "@tsed/json-mapper";
import {JsonParameterStore, PipeMethods} from "@tsed/schema";

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
