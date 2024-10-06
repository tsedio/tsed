import {Type} from "@tsed/core";

import {ParamOptions} from "../domain/ParamOptions.js";
import {ParamTypes} from "../domain/ParamTypes.js";
import {mapParamsOptions} from "../utils/mapParamsOptions.js";
import {UseParam} from "./useParam.js";

/**
 * Cookies or CookiesParams return the value from [request.cookies](http://expressjs.com/en/4x/api.html#req.cookies) object.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Post('/')
 *    create(@Cookies() cookies: any) {
 *       console.log('Entire cookies', cookies);
 *    }
 *
 *    @Post('/')
 *    create(@Cookies('id') id: string) {
 *       console.log('ID', id);
 *    }
 *
 *    @Post('/')
 *    create(@Cookies('user') user: IUser) {
 *       console.log('user', user);
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
export function CookiesParams(expression: string | any, useType: any): ParameterDecorator;
export function CookiesParams(): ParameterDecorator;
export function CookiesParams(expression: string | any): ParameterDecorator;
export function CookiesParams(options: ParamOptions<any>): ParameterDecorator;
export function CookiesParams(...args: any[]): ParameterDecorator {
  const {expression, useType, useMapper = false, useValidation = false} = mapParamsOptions(args);

  return UseParam({
    paramType: ParamTypes.COOKIES,
    expression,
    useType,
    useMapper,
    useValidation
  });
}

/**
 * Cookies or CookiesParams return the value from [request.cookies](http://expressjs.com/en/4x/api.html#req.cookies) object.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Post('/')
 *    create(@Cookies() body: any) {
 *       console.log('Entire body', body);
 *    }
 *
 *    @Post('/')
 *    create(@Cookies('id') id: string) {
 *       console.log('ID', id);
 *    }
 *
 *    @Post('/')
 *    create(@Cookies('user') user: User) { // with deserialization
 *       console.log('user', user);
 *    }
 *
 *    @Post('/')
 *    create(@Cookies('users', User) users: User[]) { // with deserialization
 *       console.log('users', users);
 *    }
 * }
 * ```
 * > For more information on deserialization see [converters](/docs/json-mapper.md) page.
 *
 * @param expression The path of the property to get.
 * @param useType The type of the class that to be used to deserialize the data.
 * @decorator
 * @aliasof CookiesParams
 * @operation
 * @input
 */
export function Cookies(expression: string, useType: Type<any>): ParameterDecorator;
export function Cookies(expression: string): ParameterDecorator;
export function Cookies(useType: Type<any>): ParameterDecorator;
export function Cookies(options: Partial<ParamOptions>): ParameterDecorator;
export function Cookies(): ParameterDecorator;
export function Cookies(...args: any[]): ParameterDecorator {
  // @ts-ignore
  return CookiesParams(...args);
}
