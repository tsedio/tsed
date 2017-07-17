import {AcceptMimesMiddleware} from "../../components/AcceptMimesMiddleware";
import {EndpointRegistry} from "../../registries/EndpointRegistry";
/**
 * @module common/mvc
 */
/** */
import {UseBefore} from "./useBefore";
/**
 * Set a mime list as acceptable for a request on a specific endpoint.
 *
 * ```typescript
 *  @ControllerProvider('/mypath')
 *  provide MyCtrl {
 *
 *    @Get('/')
 *    @AcceptMime('application/json')
 *    public getResource(){}
 *  }
 * ```
 *
 * @param mimes
 * @returns {Function}
 * @decorator
 */
export function AcceptMime(...mimes: string[]): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        EndpointRegistry.setMetadata(AcceptMimesMiddleware, mimes, target, targetKey);

        return UseBefore(AcceptMimesMiddleware)(target, targetKey, descriptor);
    };
}