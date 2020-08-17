import {Injectable} from "@tsed/di";
import {IPipe, ParamMetadata} from "../models/ParamMetadata";
import {ConverterService} from "../services/ConverterService";

@Injectable()
export class DeserializerPipe implements IPipe {
  constructor(private converterService: ConverterService) {}

  transform(value: any, param: ParamMetadata) {
    return this.converterService.deserialize(value, {
      type: param.type,
      collectionType: param.collectionType,
      ...(param.store.get(DeserializerPipe) || {})
    });
  }
}
