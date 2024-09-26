import type {Type} from "@tsed/core";
import {isArrayOrArrayClass, useDecorators} from "@tsed/core";
import {Children, Path} from "@tsed/schema";

import type {ProviderOpts} from "../interfaces/ProviderOpts.js";
import {registerController} from "../registries/ProviderRegistry.js";

export type PathType = string | RegExp | (string | RegExp)[];

export interface ControllerMiddlewares {
  useBefore: any[];
  use: any[];
  useAfter: any[];
}

export interface ControllerOptions extends Partial<ProviderOpts<any>> {
  path?: PathType;
  children?: Type<any>[];
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
  const {children = [], path, ...opts} = mapOptions(options);

  return useDecorators(
    (target: Type) => {
      registerController({
        provide: target,
        ...opts
      });
    },
    path && Path(path as any),
    Children(...children)
  );
}
