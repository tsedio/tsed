/**
 * @module mvc
 */
/** */
import {UseBefore} from "./useBefore";
import {AuthenticatedMiddleware} from "../../components/AuthenticatedMiddleware";
import {EndpointRegistry} from "../../registries/EndpointRegistry";
/**
 * Set authentification strategy on your endpoint.
 *
 * ```typescript
 * \@ControllerProvider('/mypath')
 * provide MyCtrl {
 *
 *   \@Get('/')
 *   \@Authenticated({role: 'admin'})
 *   public getResource(){}
 * }
 * ```
 *
 * @param options
 * @returns {Function}
 * @decorator
 */
export function Authenticated(options?: any): Function {

    return <T>(target: any, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        EndpointRegistry
            .get(target, targetKey)
            .store
            .set(AuthenticatedMiddleware, options)
            .merge("responses", {"403": {description: "Forbidden"}});

        return UseBefore(AuthenticatedMiddleware)(target, targetKey, descriptor);
    };

}