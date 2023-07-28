import {isClass, Metadata, nameOf} from "@tsed/core";
import {ParamTypes, UseParam} from "@tsed/platform-params";
import {ServerResponse} from "http";

function getParamType(target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
  const type = Metadata.getOwnParamTypes(target, propertyKey)[parameterIndex];

  if (isClass(type)) {
    if (nameOf(type) === "PlatformResponse") {
      return {paramType: ParamTypes.PLATFORM_RESPONSE, dataPath: "$ctx.response"};
    }

    if (type === ServerResponse) {
      return {paramType: ParamTypes.NODE_RESPONSE, dataPath: "$ctx.response.res"};
    }
  }

  return {paramType: ParamTypes.RESPONSE, dataPath: "$ctx.response.response"};
}

/**
 * Response service.
 *
 * @decorator
 * @operation
 * @input
 * @response
 */
export function Response(): ParameterDecorator;
export function Response(): ParameterDecorator {
  return Res();
}

/**
 * Request service.
 *
 * @alias Response
 * @decorator
 * @operation
 * @input
 * @response
 */
export function Res(): ParameterDecorator;
export function Res(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const {paramType, dataPath} = getParamType(target, propertyKey, parameterIndex);
    UseParam({
      paramType,
      dataPath
    })(target, propertyKey, parameterIndex);
  };
}

/**
 * Response service.
 *
 * @decorator
 * @operation
 * @input
 * @response
 */
export interface Response extends TsED.Response {}

/**
 * Response service.
 *
 * @alias Response
 * @decorator
 * @operation
 * @input
 * @response
 */
export interface Res extends Response {}
