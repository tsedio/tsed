import {isCollection, isFunction} from "@tsed/core";
import {JsonMapperContext} from "../domain/JsonMapperContext";
import {JsonMapperCtx} from "../interfaces/JsonMapperMethods";

/**
 * @deprecated
 * @ignore
 */
export function mapSerializeOptions(args: any[]): JsonMapperCtx {
  if (!(args[0] instanceof JsonMapperContext)) {
    return new JsonMapperContext({
      type: isCollection(args[0]) ? args[1] : args[0],
      collectionType: isCollection(args[0]) ? args[0] : undefined,
      next: args[2],
      options: {}
    });
  }

  return args[0];
}

/**
 * @deprecated
 * @ignore
 */
export function mapDeserializeOptions(args: any[]): JsonMapperCtx {
  if (isFunction(args[0])) {
    return {
      next: args[0]
    } as any;
  }

  return args[0];
}
