import {Constant, Injectable} from "@tsed/di";
import {deserialize} from "@tsed/json-mapper";
import {JsonParameterStore, PipeMethods} from "@tsed/schema";

@Injectable()
export class DeserializerPipe implements PipeMethods {
  transform(value: any, param: JsonParameterStore) {
    return deserialize(value, {
      useAlias: true,
      type: param.type,
      collectionType: param.collectionType,
      groups: param.parameter.groups,
      genericTypes: param.nestedGenerics[0],
      nestedGenerics: param.nestedGenerics,
      ...(param.store.get(DeserializerPipe) || {})
    });
  }
}
