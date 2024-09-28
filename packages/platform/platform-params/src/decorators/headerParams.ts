import {Type} from "@tsed/core";

import {ParamOptions} from "../domain/ParamOptions.js";
import {ParamTypes} from "../domain/ParamTypes.js";
import {mapParamsOptions} from "../utils/mapParamsOptions.js";
import {UseParam} from "./useParam.js";

/**
 * HeaderParams return the value from [`request.get()`](http://expressjs.com/en/4x/api.html#req.get) method.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Get('/')
 *    get(@HeaderParams() body: any) {
 *       console.log('Entire body', body);
 *    }
 *
 *    @Get('/')
 *    get(@HeaderParams('x-token') token: string) {
 *       console.log('token', id);
 *    }
 * }
 * ```
 *
 * @param expression The path of the property to get.
 * @param useType
 * @decorator
 * @operation
 * @input
 */
export function HeaderParams(expression: string, useType: Type<any>): ParameterDecorator;
export function HeaderParams(expression: string): ParameterDecorator;
export function HeaderParams(useType: Type<any>): ParameterDecorator;
export function HeaderParams(options: Partial<ParamOptions>): ParameterDecorator;
export function HeaderParams(): ParameterDecorator;
export function HeaderParams(...args: any[]): ParameterDecorator {
  const {expression, useType, useMapper = false, useValidation = false} = mapParamsOptions(args);

  return UseParam({
    paramType: ParamTypes.HEADER,
    expression,
    useType,
    useMapper,
    useValidation
  });
}
