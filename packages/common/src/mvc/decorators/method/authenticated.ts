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
  return UseAuth(AuthenticatedMiddleware, {
    responses: {
      "403": {
        description: "Forbidden"
      },
      ...(options.responses || {})
    },
    ...options
  });
}
