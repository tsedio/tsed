import {isClass, Metadata, nameOf} from "@tsed/core";
import {ServerResponse} from "http";
import {ParamTypes} from "../../models/ParamTypes";
import {UseParam} from "./useParam";

function getParamType(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  const type = Metadata.getOwnParamTypes(target, propertyKey)[parameterIndex];

  if (isClass(type)) {
    if (nameOf(type) === "PlatformResponse") {
      return ParamTypes.PLATFORM_RESPONSE;
    }

    if (type === ServerResponse) {
      return ParamTypes.NODE_RESPONSE;
    }
  }

  return ParamTypes.RESPONSE;
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
    UseParam(getParamType(target, propertyKey, parameterIndex))(target, propertyKey, parameterIndex);
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
