import {Type} from "@tsed/core";
import {SessionFilter} from "../components/SessionFilter";
import {IParamOptions} from "../interfaces/IParamOptions";
import {ParamTypes} from "../interfaces/ParamTypes";
import {UseFilter} from "./useFilter";
import {mapParamsOptions} from "./utils/mapParamsOptions";

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
 * }
 * ```
 * > For more information on deserialization see [converters](/docs/converters.md) page.
 *
 * @param expression The path of the property to get.
 * @param useType The type of the class that to be used to deserialize the data.
 * @decorator
 * @returns {Function}
 */
export function Session(expression: string, useType: Type<any> | Function): ParameterDecorator;
export function Session(expression: string): ParameterDecorator;
export function Session(useType: Type<any> | Function): ParameterDecorator;
export function Session(options: IParamOptions<any>): ParameterDecorator;
export function Session(): ParameterDecorator;
export function Session(...args: any[]): ParameterDecorator {
  const {expression, useType, useConverter = false, useValidation = false} = mapParamsOptions(args);

  return UseFilter(SessionFilter, {
    expression,
    useType,
    useConverter,
    useValidation,
    paramType: ParamTypes.SESSION
  });
}
