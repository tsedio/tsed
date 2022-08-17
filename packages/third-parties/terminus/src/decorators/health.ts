import {Store} from "@tsed/core";

/**
 * Create a readiness / liveness checks.
 *
 * ```ts
 * import { Health } from "@tsed/terminus";
 *
 * @Controller("/mongo")
 * class MongoCtrl {
 *   @Health("/health")
 *   health() {
 *     // Here check the mongo health
 *     return Promise.resolve();
 *   }
 * }
 *
 * @param name
 * @decorator
 * @terminus
 */
export function Health(name: string): MethodDecorator {
  return <Function>(target: Object, propertyKey: string) => {
    Store.from(target).merge(`terminus:health`, {
      [propertyKey]: {name}
    });
  };
}
