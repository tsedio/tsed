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


    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        EndpointRegistry.setMetadata(AuthenticatedMiddleware, options, target, targetKey);

        return UseBefore(AuthenticatedMiddleware)(target, targetKey, descriptor);
    };

}