import {AuthenticatedMiddleware} from "../../middlewares/AuthenticatedMiddleware";
import {IAuthOptions} from "./authOptions";
import {UseAuth} from "./useAuth";

/**
 * Use passport authentication strategy on your endpoint.
 *
 * ```typescript
 * @Controller('/mypath')
 * class MyCtrl {
 *
 *   @Get('/')
 *   @Authenticated({role: 'admin'})
 *   public getResource(){}
 * }
 * ```
 *
 * ::: warning
 * This usage is deprecated in favor of @@UseAuth@@. See [Authentication page](https://tsed.io/docs/authentication.html#usage).
 * :::
 *
 * @param options
 * @returns {Function}
 * @decorator
 * @operation
 * @deprecated See [Authentication page](https://tsed.io/docs/authentication.html#usage).
 */
export function Authenticated(options: IAuthOptions = {}): Function {
  options = {
    responses: {
      "401": {
        description: "Unauthorized",
      },
      ...(options.responses || {}),
    },
    ...options,
  };

  return UseAuth(AuthenticatedMiddleware, options);
}
