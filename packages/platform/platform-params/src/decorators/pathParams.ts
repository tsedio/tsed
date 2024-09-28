import {Type} from "@tsed/core";

import {ParamOptions} from "../domain/ParamOptions.js";
import {ParamTypes} from "../domain/ParamTypes.js";
import {mapParamsOptions} from "../utils/mapParamsOptions.js";
import {UseParam} from "./useParam.js";

/**
 * PathParams return the value from [request.params](http://expressjs.com/en/4x/api.html#req.params) object.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Get('/')
 *    get(@PathParams() params: any) {
 *       console.log('Entire params', params);
 *    }
 *
 *    @Get('/')
 *    get(@PathParams('id') id: string) {
 *       console.log('ID', id);
 *    }
 *
 *    @Get('/')
 *    get(@PathParams({expression: 'id', useType: () => new MyCustomModel() }) id: string) {
 *       console.log('ID', id);
 *    }
 * }
 * ```
 * > For more information on deserialization see [converters](/docs/json-mapper.md) page.
 *
 * @param expression The path of the property to get.
 * @param useType The type of the class that to be used to deserialize the data.
 * @decorator
 * @operation
 * @input
 */
export function PathParams(expression: string, useType: Type<any>): ParameterDecorator;
export function PathParams(expression: string): ParameterDecorator;
export function PathParams(useType: Type<any>): ParameterDecorator;
export function PathParams(options: Partial<ParamOptions>): ParameterDecorator;
export function PathParams(): ParameterDecorator;
export function PathParams(...args: any[]): ParameterDecorator {
  const {expression, useType, useMapper = true, useValidation = true} = mapParamsOptions(args);

  return UseParam({
    paramType: ParamTypes.PATH,
    expression,
    useType,
    useMapper,
    useValidation
  });
}

/**
 * RawPathParams return the raw value from [request.params](http://expressjs.com/en/4x/api.html#req.params) object.
 *
 * Any validation and transformation are performed on the value. Use [pipes](/docs/pipes.html) to validate and/or transform the value.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Get('/')
 *    get(@RawPathParams() params: string) {
 *       console.log('Entire params', params);
 *    }
 *
 *    @Get('/')
 *    get(@RawPathParams('id') id: string) {
 *       console.log('ID', id);
 *    }
 * }
 * ```
 * > For more information on deserialization see [converters](/docs/json-mapper.md) page.
 *
 * @param expression The path of the property to get.
 * @decorator
 * @operation
 * @input
 */
export function RawPathParams(expression: string): ParameterDecorator;
export function RawPathParams(options: Partial<ParamOptions>): ParameterDecorator;
export function RawPathParams(): ParameterDecorator;
export function RawPathParams(...args: any[]): ParameterDecorator {
  const {expression, useType, useMapper = false, useValidation = false} = mapParamsOptions(args);

  return PathParams({
    expression,
    useValidation,
    useMapper,
    useType
  });
}
