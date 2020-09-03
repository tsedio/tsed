import type {PlatformBaseRequest} from "../../../platform/services/PlatformRequest";
import {Type} from "@tsed/core";
import {IParamOptions} from "../../interfaces/IParamOptions";
import {ParamTypes} from "../../models/ParamTypes";
import {mapParamsOptions} from "../../utils/mapParamsOptions";
import {UseParam} from "./useParam";

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

  return UseParam(ParamTypes.REQUEST, {
    expression,
    useType,
    useConverter,
    useValidation
  });
}

/**
 * Request service.
 *
 * @decorator
 * @operation
 * @input
 */
export interface Request extends PlatformBaseRequest, TsED.Request {}

/**
 * Request service.
 *
 * @alias Request
 * @decorator
 * @operation
 * @input
 */
export interface Req extends PlatformBaseRequest, TsED.Request {}
