import {Injectable, injectable} from "@tsed/di";
import {JsonParameterStore, PipeMethods} from "@tsed/schema";
import {ParamTypes} from "../domain/ParamTypes.js";
import {PlatformParamsScope} from "../builder/PlatformParams.js";
import {getValue} from "@tsed/core";

export class ParseExpressionPipe implements PipeMethods {
  // the key of a parameter is built once instead of on each request
  #keys = new WeakMap<JsonParameterStore, string>();

  transform(scope: PlatformParamsScope, param: JsonParameterStore) {
    let key = this.#keys.get(param);

    if (key === undefined) {
      key = this.getKey(param);
      this.#keys.set(param, key);
    }

    const value = getValue(scope, key);

    if (value === "" && (param.paramType === ParamTypes.QUERY || param.paramType === ParamTypes.PATH) && param.type !== String) {
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
