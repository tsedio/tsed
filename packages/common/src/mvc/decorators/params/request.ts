import {Type} from "@tsed/core";
import {IParamOptions} from "../../interfaces/IParamOptions";
import {ParamTypes} from "../../models/ParamTypes";
import {mapParamsOptions} from "../utils/mapParamsOptions";
import {UseParam} from "./useParam";

declare global {
  namespace TsED {
    export interface Request {
      aborted: boolean;
    }
  }
}

export interface Request extends TsED.Request {}

export interface Req extends TsED.Request {}

/**
 * Request service.
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
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
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 * @alias Request
 */
export function Req(expression: string, useType: Type<any>): ParameterDecorator;
export function Req(expression: string): ParameterDecorator;
export function Req(useType: Type<any>): ParameterDecorator;
export function Req(options: IParamOptions<any>): ParameterDecorator;
export function Req(): ParameterDecorator;
export function Req(...args: any[]): ParameterDecorator {
  const {expression, useType, useConverter = false, useValidation = false} = mapParamsOptions(args);

  return UseParam(ParamTypes.REQUEST, {
    expression,
    useType,
    useConverter,
    useValidation
  });
}
