import {isClass, Metadata, nameOf, Type} from "@tsed/core";
import {IncomingMessage} from "http";
import {IParamOptions} from "../../interfaces/IParamOptions";
import {ParamTypes} from "../../models/ParamTypes";
import {mapParamsOptions} from "../../utils/mapParamsOptions";
import {UseParam} from "./useParam";

function getParamType(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  const type = Metadata.getOwnParamTypes(target, propertyKey)[parameterIndex];

  if (isClass(type)) {
    if (nameOf(type) === "PlatformRequest") {
      return ParamTypes.PLATFORM_REQUEST;
    }

    if (type === IncomingMessage) {
      return ParamTypes.NODE_REQUEST;
    }
  }

  return ParamTypes.REQUEST;
}

/**
 * Request service.
 *
 * @decorator
 * @operation
 * @input
 */
export function Request(expression: string, useType: Type<any>): ParameterDecorator;
export function Request(expression: string): ParameterDecorator;
export function Request(useType: Type<any>): ParameterDecorator;
export function Request(options: IParamOptions<any>): ParameterDecorator;
export function Request(): ParameterDecorator;
export function Request(...args: any[]): ParameterDecorator {
  // @ts-ignore
  return Req(...args);
}

/**
 * Request service.
 *
 * @alias Request
 * @decorator
 * @operation
 * @input
 */
export function Req(expression: string, useType: Type<any>): ParameterDecorator;
export function Req(expression: string): ParameterDecorator;
export function Req(useType: Type<any>): ParameterDecorator;
export function Req(options: IParamOptions<any>): ParameterDecorator;
export function Req(): ParameterDecorator;
export function Req(...args: any[]): ParameterDecorator {
  const {expression, useType, useConverter = false, useValidation = false} = mapParamsOptions(args);

  return (target, propertyKey, parameterIndex) => {
    const paramType = getParamType(target, propertyKey, parameterIndex);

    UseParam(paramType, {
      expression,
      useType,
      useConverter,
      useValidation
    })(target, propertyKey, parameterIndex);
  };
}

/**
 * Request service.
 *
 * @decorator
 * @operation
 * @input
 */
export interface Request extends TsED.Request {}

/**
 * Request service.
 *
 * @alias Request
 * @decorator
 * @operation
 * @input
 */
export interface Req extends Request {}
