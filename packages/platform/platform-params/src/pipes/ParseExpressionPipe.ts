import {getValue} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {PipeMethods, ParamMetadata} from "../domain/ParamMetadata";
import {ParamTypes} from "../domain/ParamTypes";
import type {ArgScope} from "../builder/PlatformParams";

@Injectable({
  priority: -1000
})
export class ParseExpressionPipe implements PipeMethods {
  transform(scope: ArgScope, param: ParamMetadata) {
    const {paramType, type} = param;

    const value = getValue(scope, param.key);

    if ([ParamTypes.QUERY, ParamTypes.PATH].includes(paramType as ParamTypes) && value === "" && type !== String) {
      return undefined;
    }

    return value;
  }
}
