import type {ParamOptions} from "../domain/ParamOptions.js";
import {ParamTypes} from "../domain/ParamTypes.js";
import {mapParamsOptions} from "../utils/mapParamsOptions.js";
import {UseParam} from "./useParam.js";

/**
 * Session return the value from [request.session](http://expressjs.com/en/4x/api.html#req.session) object.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Post('/')
 *    create(@Session() session: Express.Session) {
 *       console.log('Entire session', session);
 *    }
 *
 *    @Post('/')
 *    create(@Session('id') id: string) {
 *       console.log('ID', id);
 *    }
 *
 *    @Post('/') // Example to deserialize use from session
 *    create(@Session({expression: 'user', useMapper: true}) user: User) {
 *       console.log('user', user);
 *       console.log('instanceOf user', user instanceof User);
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
export function Session(expression: string): ParameterDecorator;
export function Session(options: Partial<ParamOptions>): ParameterDecorator;
export function Session(): ParameterDecorator;
export function Session(...args: any[]): ParameterDecorator {
  const {expression, useType, useMapper = false, useValidation = false} = mapParamsOptions(args);

  return UseParam({
    paramType: ParamTypes.SESSION,
    expression,
    useType,
    useMapper,
    useValidation
  });
}
