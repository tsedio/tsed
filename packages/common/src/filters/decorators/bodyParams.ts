import {Type} from "@tsed/core";
import {BodyParamsFilter} from "../components/BodyParamsFilter";
import {IParamOptions} from "../interfaces/IParamOptions";
import {ParamTypes} from "../interfaces/ParamTypes";
import {UseFilter} from "./useFilter";
import {mapParamsOptions} from "./utils/mapParamsOptions";

/**
 * BodyParams return the value from [request.body](http://expressjs.com/en/4x/api.html#req.body) object.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Post('/')
 *    create(@BodyParams() body: any) {
 *       console.log('Entire body', body);
 *    }
 *
 *    @Post('/')
 *    create(@BodyParams('id') id: string) {
 *       console.log('ID', id);
 *    }
 *
 *    @Post('/')
 *    create(@BodyParams('user') user: User) { // with deserialization
 *       console.log('user', user);
 *    }
 *
 *    @Post('/')
 *    create(@BodyParams('users', User) users: User[]) { // with deserialization
 *       console.log('users', users);
 *    }
 * }
 * ```
 * > For more information on deserialization see [converters](/docs/converters.md) page.
 *
 * @param expression The path of the property to get.
 * @param useType The type of the class that to be used to deserialize the data.
 * @decorator
 * @returns {Function}
 */
export function BodyParams(expression: string, useType: Type<any> | Function): ParameterDecorator;
export function BodyParams(expression: string): ParameterDecorator;
export function BodyParams(useType: Type<any> | Function): ParameterDecorator;
export function BodyParams(options: IParamOptions<any>): ParameterDecorator;
export function BodyParams(): ParameterDecorator;
export function BodyParams(...args: any[]): ParameterDecorator {
  const {expression, useType, useConverter = true, useValidation = true} = mapParamsOptions(args);

  return UseFilter(BodyParamsFilter, {
    expression,
    useType,
    useConverter,
    useValidation,
    paramType: ParamTypes.BODY
  });
}
