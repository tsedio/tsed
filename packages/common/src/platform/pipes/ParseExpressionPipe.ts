import {getValue} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {ParamMetadata} from "../../mvc/models/ParamMetadata";
import {ParamTypes} from "../../mvc/models/ParamTypes";

@Injectable()
export class ParseExpressionPipe {
  transform(value: any, param: ParamMetadata) {
    const {service, type} = param;
    let {expression} = param;

    if (typeof param.service !== "string" || !param.expression || !value) {
      return value;
    }

    if (service === ParamTypes.HEADER) {
      expression = (param.expression || "").toLowerCase();
    }

    // return (value: any) => {
    value = getValue(expression, value);

    if ([ParamTypes.QUERY, ParamTypes.PATH].includes(service as any) && value === "" && type !== String) {
      return undefined;
    }

    return value;
  }
}
