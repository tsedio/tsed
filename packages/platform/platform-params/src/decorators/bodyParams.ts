import {Type} from "@tsed/core";

import {ParamOptions} from "../domain/ParamOptions.js";
import {ParamTypes} from "../domain/ParamTypes.js";
import {mapParamsOptions} from "../utils/mapParamsOptions.js";
import {UseParam} from "./useParam.js";

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
  const {expression, useType, useMapper = true, useValidation = true} = mapParamsOptions(args);

  return UseParam({
    paramType: ParamTypes.BODY,
    expression,
    useType,
    useMapper,
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
export function RawBodyParams(options: Partial<Omit<ParamOptions, "expression">>): ParameterDecorator;
export function RawBodyParams(): ParameterDecorator;
export function RawBodyParams(...args: any[]): ParameterDecorator {
  const {useType, useMapper = false, useValidation = false} = mapParamsOptions(args);

  return UseParam({
    paramType: ParamTypes.RAW_BODY,
    useType,
    useMapper,
    useValidation
  });
}
