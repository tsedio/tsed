import {Store} from "../../../core/class/Store";
import {AuthenticatedMiddleware} from "../../components/AuthenticatedMiddleware";
/**
 * @module common/mvc
 */
/** */
import {UseBefore} from "./useBefore";

/**
 * Set authentication strategy on your endpoint.
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
export function Authenticated(options?: any) {
    return Store.decorate((store: Store) => {
        store
            .set(AuthenticatedMiddleware, options)
            .merge("responses", {"403": {description: "Forbidden"}});

        return UseBefore(AuthenticatedMiddleware);
    });
}