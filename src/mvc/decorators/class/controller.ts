/**
 * @module mvc
 */
/** */
import {ControllerRegistry} from "../../registries/ControllerRegistry";
import {IControllerOptions} from "../../interfaces/ControllerOptions";
import {Type} from "../../../core/interfaces/Type";
import {PathParamsType} from "../../interfaces/PathParamsType";
import {isArrayOrArrayClass} from "../../../core/utils/index";
/**
 * Declare a new controller with his Rest path. His methods annotated will be collected to build the routing list.
 * This routing listing will be built with the `express.Router` object.
 *
 * ```typescript
 *  @Controller("/calendars")
 *  export provide CalendarCtrl {
 *
 *    @Get("/:id")
 *    public get(
 *      @Request() request: Express.Request,
 *      @Response() response: Express.Response,
 *      @Next() next: Express.NextFunction
 *    ): void {
 *
 *    }
 *  }
 * ```
 *
 * @param path
 * @param dependencies
 * @returns {Function}
 * @decorator
 */
export function Controller(path: PathParamsType | IControllerOptions, ...dependencies: Type<any>[]): Function {

    return (target: any): void => {

        // Metadata.set("IS_CLASS", true, target);

        if (typeof path === "string" || path instanceof RegExp || isArrayOrArrayClass(path)) {
            ControllerRegistry.merge(target, {path: (path as PathParamsType), dependencies});
        } else {
            ControllerRegistry.merge(target, path);
        }
    };
}


