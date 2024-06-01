import {ParamTypes} from "../domain/ParamTypes.js";
import {mapParamsOptions} from "../utils/mapParamsOptions.js";
import {UseParam} from "./useParam.js";

/**
 * Locals return the value from [response.locals](http://expressjs.com/en/4x/api.html#res.locals) object.
 *
 * ::: tip
 * Locals are generally used by express and third-party like templating engine to render a page/template.
 * See [Templating](http://tsed.io/tutorials/templating.html) section for more details.
 * :::
 *
 * #### Example
 *
 * ```typescript
 *  * @Middleware()
 * class LocalsMiddleware {
 *   use(@Locals() locals: any) {
 *      // set some on locals
 *      locals.user = "user"
 *   }
 * }
 *
 * @Controller('/')
 * @UseBefore(LocalsMiddleware)
 * class MyCtrl {
 *    @Get('/')
 *    @View('home.ejs') // will use locals and returned data to render the page
 *    get(@Locals('user') user: any) {
 *       console.log('user', user);
 *
 *       return {
 *         description: 'Hello world'
 *       }
 *    }
 * }
 * ```
 *
 * @param expression The path of the property to get.
 * @decorator
 * @operation
 * @input
 * @response
 */
export function Locals(expression: string): ParameterDecorator;
export function Locals(): ParameterDecorator;
export function Locals(...args: any[]): ParameterDecorator {
  const {expression, useType, useMapper = false, useValidation = false} = mapParamsOptions(args);

  return UseParam({
    paramType: ParamTypes.LOCALS,
    expression,
    useType,
    useMapper,
    useValidation
  });
}
