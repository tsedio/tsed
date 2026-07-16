import {ResponseFilterKey, registerResponseFilter} from "../domain/ResponseFiltersContainer.js";
import {injectable} from "@tsed/di";

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
    injectable(target).class(target);
  };
}
