import {Configuration, Injectable} from "@tsed/di";
import {deserialize} from "@tsed/json-mapper";
import {PipeMethods, ParamMetadata} from "../domain/ParamMetadata";

@Injectable()
export class DeserializerPipe implements PipeMethods {
  #settings: {
    additionalProperties?: "error" | "accept" | "ignore";
  };

  constructor(@Configuration() configuration: Configuration) {
    this.#settings = configuration.get("jsonMapper", configuration.get("converter", {}));
  }

  transform(value: any, param: ParamMetadata) {
    return deserialize(value, {
      useAlias: true,
      additionalProperties: this.#settings.additionalProperties === "accept",
      type: param.type,
      collectionType: param.collectionType,
      groups: param.parameter.groups,
      genericTypes: param.nestedGenerics[0],
      nestedGenerics: param.nestedGenerics,
      ...(param.store.get(DeserializerPipe) || {})
    });
  }
}
