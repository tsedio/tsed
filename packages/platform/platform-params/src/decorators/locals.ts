import {ParamTypes} from "../domain/ParamTypes";
import {mapParamsOptions} from "../utils/mapParamsOptions";
import {UseParam} from "./useParam";

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
  const {expression, useType, useConverter = false, useValidation = false} = mapParamsOptions(args);

  return UseParam({
    paramType: ParamTypes.LOCALS,
    dataPath: "$ctx.response.locals",
    expression,
    useType,
    useConverter,
    useValidation
  });
}
