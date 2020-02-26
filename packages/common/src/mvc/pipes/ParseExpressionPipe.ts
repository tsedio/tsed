import {getValue} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {IPipe, ParamMetadata} from "../models/ParamMetadata";
import {ParamTypes} from "../models/ParamTypes";

@Injectable()
export class ParseExpressionPipe implements IPipe {
  transform(value: any, param: ParamMetadata) {
    if (!value) {
      return value;
    }

    const {paramType, type} = param;
    let {expression} = param;

    if (paramType === ParamTypes.HEADER) {
      expression = String(param.expression).toLowerCase();
    }

    // return (value: any) => {
    value = getValue(expression, value);

    if ([ParamTypes.QUERY, ParamTypes.PATH].includes(paramType as ParamTypes) && value === "" && type !== String) {
      return undefined;
    }

    return value;
  }
}
