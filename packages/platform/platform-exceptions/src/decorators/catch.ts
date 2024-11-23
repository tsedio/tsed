import {Type} from "@tsed/core";
import {injectable, registerProvider} from "@tsed/di";

import {registerExceptionType} from "../domain/ExceptionFiltersContainer.js";

/**
 * Register a new class to handle an specific exception.
 * @decorator
 * @param types
 */
export function Catch(...types: (Type<Error | any> | string)[]) {
  return (target: any) => {
    types.forEach((type) => {
      registerExceptionType(type, target as any);
    });
    injectable(target).class(target);
  };
}
