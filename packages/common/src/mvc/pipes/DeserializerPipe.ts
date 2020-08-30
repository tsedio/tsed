import {Injectable} from "@tsed/di";
import {ConverterService} from "../../converters/services/ConverterService";
import {IPipe, ParamMetadata} from "../../mvc/models/ParamMetadata";
import {ParamTypes} from "../models/ParamTypes";

@Injectable()
export class DeserializerPipe implements IPipe {
  constructor(private converterService: ConverterService) {}

  transform(value: any, param: ParamMetadata) {
    return this.converterService.deserialize(value, param.collectionType || param.type, param.type, {
      additionalProperties: param.paramType === ParamTypes.QUERY ? "ignore" : undefined,
    });
  }
}
