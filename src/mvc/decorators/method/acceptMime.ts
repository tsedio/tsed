import {Store} from "../../../core/class/Store";
import {DecoratorParameters} from "../../../core/interfaces";
import {AcceptMimesMiddleware} from "../../components/AcceptMimesMiddleware";
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
    return Store.decorate((store: Store, parameters: DecoratorParameters) => {
        store.set(AcceptMimesMiddleware, mimes);
        return UseBefore(AcceptMimesMiddleware);
    });
}