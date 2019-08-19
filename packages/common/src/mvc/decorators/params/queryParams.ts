import {Type} from "@tsed/core";
import {IParamOptions} from "../../interfaces/IParamOptions";
import {ParamTypes} from "../../models/ParamTypes";
import {UseFilter} from "./useFilter";
import {mapParamsOptions} from "./utils/mapParamsOptions";

/**
 * QueryParams return the value from [request.query](http://expressjs.com/en/4x/api.html#req.query) object.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Get('/')
 *    get(@QueryParams() query: any) {
 *       console.log('Entire query', query);
 *    }
 *
 *    @Get('/')
 *    get(@QueryParams('id') id: string) {
 *       console.log('ID', id);
 *    }
 *
 *    @Get('/')
 *    get(@QueryParams('user') user: User) { // with deserialization
 *       console.log('user', user);
 *    }
 *
 *    @Get('/')
 *    get(@QueryParams('users', User) users: User[]) { // with deserialization
 *       console.log('users', users);
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
export function QueryParams(expression: string, useType: Type<any>): ParameterDecorator;
export function QueryParams(expression: string): ParameterDecorator;
export function QueryParams(useType: Type<any>): ParameterDecorator;
export function QueryParams(options: IParamOptions<any>): ParameterDecorator;
export function QueryParams(): ParameterDecorator;
export function QueryParams(...args: any[]): ParameterDecorator {
  const {expression, useType, useConverter = true, useValidation = true} = mapParamsOptions(args);

  return UseFilter(ParamTypes.QUERY, {
    expression,
    useType,
    useConverter,
    useValidation
  });
}
