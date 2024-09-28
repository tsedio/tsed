import {Store, Type} from "@tsed/core";

import {JsonEntityFn} from "../common/jsonEntityFn.js";

/**
 * Add Children class to compose routes
 *
 * @decorator
 * @swagger
 * @schema
 * @classDecorator
 * @param children
 */
export function Children(...children: Type<any>[]): ClassDecorator {
  return JsonEntityFn((store) => {
    store.store.set("childrenControllers", children);

    children.forEach((childToken) => {
      Store.from(childToken).set("parentController", store.token);
    });
  });
}
