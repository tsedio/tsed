import {nameOf} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {RequiredParamError} from "../errors/RequiredParamError";
import {IPipe, ParamMetadata} from "../models/ParamMetadata";

@Injectable()
export class RequiredPipe implements IPipe {
  transform(value: any, param: ParamMetadata) {
    if (param.isRequired(value)) {
      throw new RequiredParamError(nameOf(param.service), param.expression);
    }

    return value;
  }
}
