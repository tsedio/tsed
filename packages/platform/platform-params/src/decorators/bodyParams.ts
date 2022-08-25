import {Type} from "@tsed/core";
import {ParamOptions} from "../domain/ParamOptions";
import {ParamTypes} from "../domain/ParamTypes";
import {UseParam} from "./useParam";
import {mapParamsOptions} from "../utils/mapParamsOptions";

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
 * > For more information on deserialization see [converters](/docs/json-mapper.md) page.
 *
 * @param expression The path of the property to get.
 * @param useType The type of the class that to be used to deserialize the data.
 * @decorator
 * @operation
 * @input
 */
export function BodyParams(expression: string, useType: Type<any>): ParameterDecorator;
export function BodyParams(expression: string): ParameterDecorator;
export function BodyParams(useType: Type<any>): ParameterDecorator;
export function BodyParams(options: Partial<ParamOptions>): ParameterDecorator;
export function BodyParams(): ParameterDecorator;
export function BodyParams(...args: any[]): ParameterDecorator {
  const {expression, useType, useConverter = true, useValidation = true} = mapParamsOptions(args);

  return UseParam({
    paramType: ParamTypes.BODY,
    expression,
    useType,
    useConverter,
    useValidation
  });
}

/**
 * RawBodyParams return the value from [request.body](http://expressjs.com/en/4x/api.html#req.body) as a Buffer.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Post('/')
 *    create(@RawBodyParams() body: Buffer) {
 *       console.log('Entire body', body.toString("utf8"));
 *    }
 * }
 * ```
 *
 * @decorator
 * @operation
 * @input
 * @alias BodyParams Example: @BodyParams() payload: Buffer
 */
export function RawBodyParams(): ParameterDecorator {
  return UseParam({
    paramType: ParamTypes.RAW_BODY,
    useConverter: false,
    useValidation: false
  });
}
