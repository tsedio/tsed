import {Type} from "@tsed/core";
import {ParamOptions} from "../domain/ParamOptions";
import {ParamTypes} from "../domain/ParamTypes";
import {mapParamsOptions} from "../utils/mapParamsOptions";
import {UseParam} from "./useParam";

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
 * > For more information on deserialization see [converters](/docs/json-mapper.md) page.
 *
 * @param expression The path of the property to get.
 * @param useType The type of the class that to be used to deserialize the data.
 * @decorator
 * @operation
 * @input
 */
export function QueryParams(expression: string, useType: Type<any>): ParameterDecorator;
export function QueryParams(expression: string): ParameterDecorator;
export function QueryParams(useType: Type<any>): ParameterDecorator;
export function QueryParams(options: Partial<ParamOptions>): ParameterDecorator;
export function QueryParams(): ParameterDecorator;
export function QueryParams(...args: any[]): ParameterDecorator {
  const {expression, useType, useConverter = true, useValidation = true} = mapParamsOptions(args);

  return UseParam({
    paramType: ParamTypes.QUERY,
    expression,
    useType,
    useConverter,
    useValidation
  });
}

/**
 * RawQueryParams return the value from [request.query](http://expressjs.com/en/4x/api.html#req.query) object.
 *
 * Any validation and transformation are performed on the value. Use [pipes](/docs/pipes.html) to validate and/or transform the value.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Get('/')
 *    get(@RawPathParams() params: any) {
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
export function RawQueryParams(expression: string) {
  return QueryParams({
    expression,
    useConverters: false,
    useValidation: false
  });
}
