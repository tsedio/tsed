import {Store} from "@tsed/core/types/Store.js";
import type {Type} from "@tsed/core/types/Type.js";
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
 * Declare a REST controller with a base path for routing.
 *
 * Registers a class as a controller provider that handles HTTP requests.
 * Annotated methods define routes relative to the controller's base path.
 *
 * ### Usage
 *
 * ```typescript
 * import {Controller, Get} from "@tsed/di";
 *
 * @Controller("/calendars")
 * export class CalendarCtrl {
 *   @Get("/:id")
 *   get(@PathParams("id") id: string) {
 *     return {id};
 *   }
 * }
 *
 * // With middleware
 * @Controller({
 *   path: "/users",
 *   middlewares: {
 *     useBefore: [AuthMiddleware]
 *   }
 * })
 * export class UserCtrl {}
 *
 * // Nested controllers
 * @Controller({
 *   path: "/admin",
 *   children: [UserAdminCtrl, ProductAdminCtrl]
 * })
 * export class AdminCtrl {}
 * ```
 *
 * ### Options
 *
 * - `path`: Base route path (string, RegExp, or array)
 * - `children`: Child controller classes for nested routing
 * - `middlewares`: Middleware configuration (useBefore, use, useAfter)
 * - Additional `ProviderOpts` options
 *
 * @param options Controller path or configuration object
 * @returns Class decorator function
 * @public
 * @decorator
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
