import {Store} from "@tsed/core/types/Store.js";
import {Type} from "@tsed/core/types/Type.js";
import {classOf} from "@tsed/core/utils/classOf.js";
import {isArrayOrArrayClass} from "@tsed/core/utils/isArray.js";
import {useDecorators} from "@tsed/core/utils/useDecorators.js";

import type {ControllerMiddlewares} from "../domain/ControllerProvider.js";
import {controller} from "../fn/injectable.js";
import {ProviderOpts} from "../interfaces/ProviderOpts.js";

export type PathType = string | RegExp | (string | RegExp)[];

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
 *  export class CalendarCtrl {
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

  return useDecorators((target: Type) => {
    const factory = controller(target, opts);

    if (path) {
      factory.store().set("path", path);
    }

    factory.store().set("childrenControllers", children);

    children.forEach((childToken) => {
      Store.from(childToken).set("parentController", classOf(target));
    });
  });
}
