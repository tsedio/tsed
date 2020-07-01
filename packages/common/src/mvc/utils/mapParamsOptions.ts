import {isObject} from "@tsed/core";
import {IParamOptions} from "../interfaces/IParamOptions";

/**
 * @ignore
 */
export function mapParamsOptions(args: any[]): IParamOptions<any> {
  if (args.length === 1) {
    if (typeof args[0] === "string") {
      return {
        expression: args[0]
      };
    }

    if (!isObject(args[0])) {
      return {
        useType: args[0]
      };
    }

    return args[0];
  }

  return {
    expression: args[0],
    useType: args[1]
  };
}
