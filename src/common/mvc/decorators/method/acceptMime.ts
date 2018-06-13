import {DecoratorParameters, Store} from "@tsed/core";
import {AcceptMimesMiddleware} from "../../components/AcceptMimesMiddleware";
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
