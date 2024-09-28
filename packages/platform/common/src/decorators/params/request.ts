import {isClass, Metadata, nameOf, Type} from "@tsed/core";
import {mapParamsOptions, ParamOptions, ParamTypes, UseParam} from "@tsed/platform-params";
import {IncomingMessage} from "http";

function getParamType(target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
  const type = Metadata.getOwnParamTypes(target, propertyKey)[parameterIndex];

  if (isClass(type)) {
    if (nameOf(type) === "PlatformRequest") {
      return {paramType: ParamTypes.PLATFORM_REQUEST, dataPath: "$ctx.request"};
    }

    if (type === IncomingMessage) {
      return {paramType: ParamTypes.NODE_REQUEST, dataPath: "$ctx.request.req"};
    }
  }

  return {paramType: ParamTypes.REQUEST, dataPath: "$ctx.request.request"};
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
export function Request(options: ParamOptions<any>): ParameterDecorator;
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
export function Req(options: Partial<ParamOptions>): ParameterDecorator;
export function Req(): ParameterDecorator;
export function Req(...args: any[]): ParameterDecorator {
  const {expression, useType, useMapper = false, useValidation = false} = mapParamsOptions(args);

  return (target, propertyKey, parameterIndex) => {
    const {paramType, dataPath} = getParamType(target, propertyKey, parameterIndex);

    UseParam({
      paramType,
      dataPath,
      expression,
      useType,
      useMapper,
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
