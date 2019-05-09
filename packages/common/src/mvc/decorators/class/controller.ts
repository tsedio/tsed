import {isArrayOrArrayClass, Type} from "@tsed/core";
import {registerController} from "@tsed/di";
import {IControllerProvider, PathParamsType} from "../../interfaces";

/**
 * Declare a new controller with his Rest path. His methods annotated will be collected to build the routing list.
 * This routing listing will be built with the `express.Router` object.
 *
 * ::: tip
 * See [Controllers](/docs/controllers.md) section for more details
 * :::
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
 * @param options
 * @param children
 * @returns {Function}
 * @decorator
 */
export function Controller(options: PathParamsType | IControllerProvider, ...children: Type<any>[]): Function {
  return (target: any): void => {
    if (typeof options === "string" || options instanceof RegExp || isArrayOrArrayClass(options)) {
      registerController({
        provide: target,
        path: options,
        children
      });
    } else {
      registerController({
        provide: target,
        children: (options as IControllerProvider).dependencies || (options as IControllerProvider).children,
        ...options
      });
    }
  };
}
