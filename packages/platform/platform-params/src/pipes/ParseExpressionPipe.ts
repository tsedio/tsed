import {Injectable, injectable} from "@tsed/di";
import {JsonParameterStore, PipeMethods} from "@tsed/schema";
import {ParamTypes} from "../domain/ParamTypes.js";
import {PlatformParamsScope} from "../builder/PlatformParams.js";
import {getValue} from "@tsed/core";

export class ParseExpressionPipe implements PipeMethods {
  transform(scope: PlatformParamsScope, param: JsonParameterStore) {
    const {paramType, type} = param;

    const value = getValue(scope, this.getKey(param));

    if ([ParamTypes.QUERY, ParamTypes.PATH].includes(paramType as ParamTypes) && value === "" && type !== String) {
      return undefined;
    }

    return value;
  }

  protected getKey(param: JsonParameterStore) {
    let {expression, paramType, dataPath} = param;
    paramType = paramType || param.parameter.get("in").toUpperCase();

    if (expression && paramType === ParamTypes.HEADER) {
      expression = String(expression).toLowerCase();
    }

    return [dataPath, expression].filter(Boolean).join(".");
  }
}

injectable(ParseExpressionPipe).priority(-1000);
