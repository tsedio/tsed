import {Type} from "@tsed/core";
import * as Express from "express";
import {ParamTypes} from "../../models/ParamTypes";
import {UseFilter} from "./useFilter";
import {mapParamsOptions} from "./utils/mapParamsOptions";
import {IParamOptions} from "../../interfaces/IParamOptions";

export type Request = Express.Request;
export type Req = Express.Request;

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

  return UseFilter(ParamTypes.REQUEST, {
    expression,
    useType,
    useConverter,
    useValidation
  });
}
