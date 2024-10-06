import {isObject} from "@tsed/core";

import {ParamOptions} from "../domain/ParamOptions.js";

/**
 * @ignore
 */
export function mapParamsOptions(args: any[]): Partial<ParamOptions<any>> {
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

    const opts = args[0] as ParamOptions;

    return {
      ...opts,
      useMapper: opts.useMapper
    };
  }

  return {
    expression: args[0],
    useType: args[1]
  };
}
