import {Constant, Injectable} from "@tsed/di";
import {deserialize} from "@tsed/json-mapper";
import {ParamMetadata, PipeMethods} from "../domain/ParamMetadata";

@Injectable()
export class DeserializerPipe implements PipeMethods {
  @Constant("converter", {})
  private settings: {
    additionalProperties?: "error" | "accept" | "ignore";
  };

  transform(value: any, param: ParamMetadata) {
    return deserialize(value, {
      useAlias: true,
      additionalProperties: this.settings.additionalProperties === "accept",
      type: param.type,
      collectionType: param.collectionType,
      groups: param.parameter.groups,
      genericTypes: param.nestedGenerics[0],
      nestedGenerics: param.nestedGenerics,
      ...(param.store.get(DeserializerPipe) || {})
    });
  }
}
