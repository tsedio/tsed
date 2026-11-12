import {injectable} from "@tsed/di";
import {JsonParameterStore, PipeMethods} from "@tsed/schema";
import {ParamTypes} from "../domain/ParamTypes.js";
import {PlatformParamsScope} from "../builder/PlatformParams.js";

function readKey(scope: any, key: string) {
  const value = scope[key];

  if (value !== undefined || (typeof scope === "object" && key in scope)) {
    return value;
  }

  if (typeof scope.get === "function") {
    return scope.get(key);
  }

  return undefined;
}

export class ParseExpressionPipe implements PipeMethods {
  // the key of a parameter, and the reader of its value, are built once instead of on each request
  #keys = new WeakMap<JsonParameterStore, string>();
  #readers = new WeakMap<JsonParameterStore, (scope: PlatformParamsScope) => unknown>();

  transform(scope: PlatformParamsScope, param: JsonParameterStore) {
    const value = this.getReader(param)(scope);

    if (value === "" && (param.paramType === ParamTypes.QUERY || param.paramType === ParamTypes.PATH) && param.type !== String) {
      return undefined;
    }

    return value;
  }

  /**
   * Same rules as getValue(scope, key) from @tsed/core, with the key split once.
   */
  protected getReader(param: JsonParameterStore) {
    let reader = this.#readers.get(param);

    if (!reader) {
      const key = this.getKey(param);
      const keys = key.split(".");
      const length = keys.length;

      reader = !key
        ? (scope) => scope
        : (scope) => {
            let value: any = scope;

            for (let index = 0; index < length && value; index++) {
              value = readKey(value, keys[index]);
            }

            return value;
          };

      this.#readers.set(param, reader);
    }

    return reader;
  }

  protected getKey(param: JsonParameterStore) {
    let key = this.#keys.get(param);

    if (key === undefined) {
      let {expression, paramType, dataPath} = param;
      paramType = paramType || param.parameter.get("in").toUpperCase();

      if (expression && paramType === ParamTypes.HEADER) {
        expression = String(expression).toLowerCase();
      }

      key = [dataPath, expression].filter(Boolean).join(".");

      this.#keys.set(param, key);
    }

    return key;
  }
}

injectable(ParseExpressionPipe).priority(-1000);
