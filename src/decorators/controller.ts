import {
    CONTROLLER_DEPEDENCIES, CONTROLLER_ROUTER_OPTIONS, CONTROLLER_SCOPE, CONTROLLER_URL
} from "../constants/metadata-keys";
import Metadata from "../services/metadata";
/**
 * Declare a new controller with his Rest path. His methods annotated will be collected to build the routing list.
 * This routing listing will be built with the `express.Router` object.
 *
 * ```typescript
 * \@Controller("/calendars")
 * export class CalendarCtrl {
 *
 *   \@Get("/:id")
 *   public get(
 *       \@Request() request: Express.Request,
 *       \@Response() response: Express.Response,
 *       \@Next() next: Express.NextFunction
 *   ): void {
 *
 *   }
 * }
 * ```
 *
 * @param ctrlUrl
 * @param ctlrDepedencies
 * @returns {Function}
 * @constructor
 */
export function Controller(ctrlUrl: string, ...ctlrDepedencies: any[]): Function {

    return (target: any): void => {

        /* istanbul ignore next */
        if (!Metadata.has(CONTROLLER_URL, target)) {
            Metadata.set(CONTROLLER_URL, ctrlUrl, target);
            Metadata.set(CONTROLLER_DEPEDENCIES, ctlrDepedencies, target);
        }

    };
}

export function Scope(target: any): void {

    /* istanbul ignore next */
    Metadata.set(CONTROLLER_SCOPE, true, target);
}

export function RouterSettings(options: { caseSensitive?: boolean, mergeParams?: boolean, strict?: boolean }): Function {

    return (target: any): void => {

        Metadata.set(CONTROLLER_ROUTER_OPTIONS, Object.assign(options || {}, {}), target);

    };
}

export function MergeParams(mergeParams: boolean) {
    return RouterSettings({mergeParams});
}

export function CaseSensitive(caseSensitive: boolean) {
    return RouterSettings({caseSensitive});
}

export function Strict(strict: boolean) {
    return RouterSettings({strict});
}