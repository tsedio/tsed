import {isArrayOrArrayClass, Type, useDecorators} from "@tsed/core";
import {IProvider} from "../interfaces/IProvider";
import {registerController} from "../registries/ProviderRegistry";
import {Children} from "@tsed/schema";

export type PathType = string | RegExp | (string | RegExp)[];

export interface ControllerMiddlewares {
  useBefore: any[];
  use: any[];
  useAfter: any[];
}

export interface ControllerOptions extends Partial<IProvider<any>> {
  path?: PathType;
  children?: Type<any>[];
  routerOptions?: any;
  middlewares?: Partial<ControllerMiddlewares>;
}

function mapOptions(options: any): ControllerOptions {
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
 * @controller
 * @decorator
 * @classDecorator
 */
export function Controller(options: PathType | ControllerOptions): ClassDecorator {
  const {children = [], ...opts} = mapOptions(options);

  return useDecorators((target: Type) => {
    registerController({
      provide: target,
      ...opts
    });
  }, Children(...children));
}
