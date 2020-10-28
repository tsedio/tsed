import {Type} from "@tsed/core";
import {IParamOptions} from "../../interfaces/IParamOptions";
import {ParamTypes} from "../../models/ParamTypes";
import {UseParam} from "./useParam";
import {mapParamsOptions} from "../../utils/mapParamsOptions";

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
 * @decorator
 * @operation
 * @input
 */
export function HeaderParams(expression: string, useType: Type<any>): ParameterDecorator;
export function HeaderParams(expression: string): ParameterDecorator;
export function HeaderParams(useType: Type<any>): ParameterDecorator;
export function HeaderParams(options: IParamOptions<any>): ParameterDecorator;
export function HeaderParams(): ParameterDecorator;
export function HeaderParams(...args: any[]): ParameterDecorator {
  const {expression, useType, useConverter = false, useValidation = false} = mapParamsOptions(args);

  return UseParam(ParamTypes.HEADER, {
    expression,
    useType,
    useConverter,
    useValidation
  });
}
