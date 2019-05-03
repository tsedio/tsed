import {AuthenticatedMiddleware} from "../../components/AuthenticatedMiddleware";
import {IUseAuthOptions, UseAuth} from "./useAuth";

/**
 * Use passport authentication strategy on your endpoint.
 *
 * ```typescript
 * @ControllerProvider('/mypath')
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
 */
export function Authenticated(options: IUseAuthOptions = {}): Function {
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
