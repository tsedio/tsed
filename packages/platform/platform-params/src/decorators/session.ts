import {ParamOptions} from "../domain/ParamOptions";
import {ParamTypes} from "../domain/ParamTypes";
import {mapParamsOptions} from "../utils/mapParamsOptions";
import {UseParam} from "./useParam";

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
 *    create(@Session({expression: 'user', useConverter: true}) user: User) {
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
  const {expression, useType, useConverter = false, useValidation = false} = mapParamsOptions(args);

  return UseParam({
    paramType: ParamTypes.SESSION,
    expression,
    useType,
    useConverter,
    useValidation
  });
}
