import {Type} from "@tsed/core";
import {registerProvider} from "@tsed/di";

import {registerResponseFilter, ResponseFilterKey} from "../domain/ResponseFiltersContainer.js";

/**
 * Register a response filter service.
 * @param contentTypes
 * @decorator
 */
export function ResponseFilter(...contentTypes: ResponseFilterKey[]): ClassDecorator {
  return (target: any) => {
    contentTypes.forEach((contentType) => {
      registerResponseFilter(contentType, target as any);
    });
    registerProvider({
      provide: target,
      useClass: target as unknown as Type<any>
    });
  };
}
