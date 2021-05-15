import {Injectable} from "@tsed/di";
import {PipeMethods, ParamMetadata} from "../models/ParamMetadata";
import {ConverterService} from "../services/ConverterService";

@Injectable()
export class DeserializerPipe implements PipeMethods {
  constructor(private converterService: ConverterService) {}

  transform(value: any, param: ParamMetadata) {
    return this.converterService.deserialize(value, {
      type: param.type,
      collectionType: param.collectionType,
      groups: param.parameter.groups,
      ...(param.store.get(DeserializerPipe) || {})
    });
  }
}
