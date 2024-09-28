import {isCollection, Metadata, Store} from "@tsed/core";

import {SocketFilters} from "../interfaces/SocketFilters.js";

/**
 * Inject the list of arguments in the decorated parameter.
 *
 * `@Args` accept an index parameter to pick up directly the item in the arguments list.
 *
 * ### Example
 *
 * ```typescript
 * @SocketService("/nsp")
 * export class MyWS {
 *
 *   @Input("event")
 *   myMethod(@Args() arguments: any[]) {
 *
 *   }
 *
 *   @Input("event2")
 *   myMethod2(@Args(0) data: any) {
 *
 *   }
 * }
 * ```
 *
 * @decorator
 * @param mapIndex
 * @param useType
 */
export function Args(mapIndex?: number, useType?: any): any {
  return (target: any, propertyKey: string, index: number) => {
    const store = Store.from(target);
    const type = Metadata.getParamTypes(target, propertyKey)[index];
    const param = {
      filter: SocketFilters.ARGS,
      useMapper: false
    };

    if (mapIndex !== undefined) {
      Object.assign(param, {
        mapIndex,
        useMapper: true,
        type: useType || type,
        collectionType: isCollection(type) ? type : undefined
      });
    }

    store.merge("socketIO", {
      handlers: {
        [propertyKey]: {
          parameters: {
            [index]: param
          }
        }
      }
    });
  };
}
