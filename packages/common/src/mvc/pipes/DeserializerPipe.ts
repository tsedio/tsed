import {Injectable} from "@tsed/di";
import {ConverterService} from "../../converters/services/ConverterService";
import {IPipe, ParamMetadata} from "../../mvc/models/ParamMetadata";

@Injectable()
export class DeserializerPipe implements IPipe {
  constructor(private converterService: ConverterService) {}

  transform(value: any, param: ParamMetadata) {
    return this.converterService.deserialize(value, param.collectionType || param.type, param.type);
  }
}
