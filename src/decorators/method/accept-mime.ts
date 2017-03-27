
import {Endpoint} from "../../controllers/endpoint";
import {UseBefore} from "./use-before";
import AcceptMimeMiddleware from "../../middlewares/accept-mimes";
/**
 * Set a mime list as acceptable for a request on a specific endpoint.
 *
 * ```typescript
 * \@Controller('/mypath')
 * class MyCtrl {
 *
 *   \@Get('/')
 *   \@AcceptMime('application/json')
 *   public getResource(){}
 * }
 * ```
 *
 * @param mimes
 * @returns {Function}
 * @constructor
 */
export function AcceptMime(...mimes: string[]): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        Endpoint.setMetadata(AcceptMimeMiddleware, mimes, target, targetKey);

        return UseBefore(AcceptMimeMiddleware)(target, targetKey, descriptor);
    };
}