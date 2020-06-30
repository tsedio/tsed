import {Type} from "@tsed/core";
import {IParamOptions} from "../../interfaces/IParamOptions";
import {ParamTypes} from "../../models/ParamTypes";
import {UseParam} from "./useParam";
import {mapParamsOptions} from "../../utils/mapParamsOptions";

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
 * > For more information on deserialization see [converters](/docs/converters.md) page.
 *
 * @param expression The path of the property to get.
 * @decorator
 * @returns {Function}
 */
export function Session(expression: string): ParameterDecorator;
export function Session(options: IParamOptions<any>): ParameterDecorator;
export function Session(): ParameterDecorator;
export function Session(...args: any[]): ParameterDecorator {
  const {expression, useType, useConverter = false, useValidation = false} = mapParamsOptions(args);

  return UseParam(ParamTypes.SESSION, {
    expression,
    useType,
    useConverter,
    useValidation
  });
}
