import {Locals} from "@tsed/platform-params";

/**
 * State return the value from koa.ctx.state object.
 *
 * #### Example
 *
 * ```typescript
 *  * @Middleware()
 * class StateMiddleware {
 *   use(@State() state: any) {
 *      // set some on locals
 *      state.user = "user"
 *   }
 * }
 *
 * @Controller('/')
 * @UseBefore(StateMiddleware)
 * class MyCtrl {
 *    @Get('/')
 *    @View('home.ejs') // will use locals and returned data to render the page
 *    get(@State('user') user: any) {
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
 * @koa
 */
export function State(expression: string): ParameterDecorator;
export function State(): ParameterDecorator;
export function State(...args: any[]): ParameterDecorator {
  return (Locals as any)(...args);
}
