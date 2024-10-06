import {BaseContext} from "@tsed/di";

import {ParamTypes} from "../domain/ParamTypes.js";
import {mapParamsOptions} from "../utils/mapParamsOptions.js";
import {UseParam} from "./useParam.js";

/**
 * Context decorator return the @@PlatformContext@@ created by Ts.ED when request is handled by the server.
 *
 * It contains some information as following:
 *
 * - The request id,
 * - The request container used by the Ts.ED DI. It contain all services annotated with `@Scope(ProviderScope.REQUEST)`,
 * - The current @@EndpointMetadata@@ resolved by Ts.ED during the request,
 * - The data return by the previous endpoint if you use multiple handler on the same route. By default data is empty.
 *
 * ::: tip
 * The @@PlatformContext@@ inherit from Map class. So you can store any information with.
 * :::
 *
 * #### Example
 *
 * ```typescript
 * @Middleware()
 * class AuthTokenMiddleware {
 *   use(@Req() request: Req, @Context() context: PlatformContext) {
 *      if (!context.has("auth")){
 *        context.set('auth', new AuthToken(request))
 *      }
 *
 *      try {
 *        context.get("auth").claims() // check token
 *      } catch(er){
 *        throw new Forbidden("Access forbidden - Bad token")
 *      }
 *   }
 * }
 *
 * @Controller('/')
 * @UseBefore(AuthTokenMiddleware) // protect all routes for this controller
 * class MyCtrl {
 *    @Get('/')
 *    get(@Context('auth') auth: AuthToken) {
 *       console.log('auth', auth);
 *       console.log('auth.accessToken', auth.accessToken);
 *       console.log('auth.idToken', auth.idToken);
 *    }
 * }
 * ```
 *
 * @param expression The path of the property to get.
 * @decorator
 * @operation
 * @input
 */
export function Context(expression: string): ParameterDecorator;
export function Context(): ParameterDecorator;
export function Context(...args: any[]): ParameterDecorator {
  const {expression, useType, useMapper = false, useValidation = false} = mapParamsOptions(args);

  return UseParam({
    paramType: ParamTypes.$CTX,
    expression,
    useType,
    useMapper,
    useValidation
  });
}

export type Context = BaseContext;
