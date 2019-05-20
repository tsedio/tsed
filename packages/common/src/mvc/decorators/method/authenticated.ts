import {AuthenticatedMiddleware} from "../../components/AuthenticatedMiddleware";
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
 * @param options
 * @returns {Function}
 * @decorator
 * @endpoint
 */
export function Authenticated(options: IAuthOptions = {}): Function {
  options = {
    responses: {
      "401": {
        description: "Unauthorized"
      },
      ...(options.responses || {})
    },
    ...options
  };

  return UseAuth(AuthenticatedMiddleware, options);
}
