import {isArrayOrArrayClass, Type} from "@tsed/core";
import {IProvider, registerController} from "@tsed/di";
import {PathParamsType} from "../../interfaces";

export interface IControllerMiddlewares {
  useBefore: any[];
  use: any[];
  useAfter: any[];
}

export interface IControllerOptions extends Partial<IProvider<any>> {
  path?: PathParamsType;
  /**
   * @deprecated
   */
  dependencies?: Type<any>[];
  children?: Type<any>[];
  routerOptions?: any;
  middlewares?: Partial<IControllerMiddlewares>;
}

function mapOptions(options: any): IControllerOptions {
  if (typeof options === "string" || options instanceof RegExp || isArrayOrArrayClass(options)) {
    return {
      path: options
    };
  }

  return options;
}

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
 *      @Req() request: Req,
 *      @Res() response: Res,
 *      @Next() next: Next
 *    ): void {
 *
 *    }
 *  }
 * ```
 *
 * @param options
 * @param children
 * @controller
 * @decorator
 * @classDecorator
 */
export function Controller(options: PathParamsType | IControllerOptions, ...children: Type<any>[]): ClassDecorator {
  const opts = mapOptions(options);

  return (target) => {
    registerController({
      provide: target,
      ...opts,
      children: (opts.children || []).concat(children)
    });
  };
}
