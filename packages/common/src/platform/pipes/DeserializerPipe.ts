import {Injectable} from "@tsed/di";
import {ConverterService} from "../../converters/services/ConverterService";
import {IPipe} from "../../mvc/interfaces/IPipe";
import {ParamMetadata} from "../../mvc/models/ParamMetadata";

@Injectable()
export class DeserializerPipe implements IPipe {
  constructor(private converterService: ConverterService) {}

  transform(value: any, param: ParamMetadata) {
    if (param.useConverter) {
      return this.converterService.deserialize(value, param.collectionType || param.type, param.type);
    }

    return value;
  }
}
