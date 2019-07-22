import {Type} from "@tsed/core";
import {PathParamsFilter} from "../components/PathParamsFilter";
import {IParamOptions} from "../interfaces/IParamOptions";
import {ParamTypes} from "../interfaces/ParamTypes";
import {UseFilter} from "./useFilter";
import {mapParamsOptions} from "./utils/mapParamsOptions";

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
 * > For more information on deserialization see [converters](/docs/converters.md) page.
 *
 * @param expression The path of the property to get.
 * @param useType The type of the class that to be used to deserialize the data.
 * @decorator
 * @returns {ParameterDecorator}
 */
export function PathParams(expression: string, useType: Type<any> | Function): ParameterDecorator;
export function PathParams(expression: string): ParameterDecorator;
export function PathParams(useType: Type<any> | Function): ParameterDecorator;
export function PathParams(options: IParamOptions<any>): ParameterDecorator;
export function PathParams(): ParameterDecorator;
export function PathParams(...args: any[]): ParameterDecorator {
  const {expression, useType, useConverter = false, useValidation = false} = mapParamsOptions(args);

  return UseFilter(PathParamsFilter, {
    expression,
    useType,
    useConverter,
    useValidation,
    paramType: ParamTypes.PATH
  });
}
