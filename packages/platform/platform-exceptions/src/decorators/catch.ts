import {Type} from "@tsed/core";
import {registerProvider} from "@tsed/di";
import {registerExceptionType} from "../domain/ExceptionFiltersContainer";

/**
 * Register a new class to handle a specific exception.
 * @decorator
 * @param types
 */
export function Catch(...types: (Type<Error | any> | string)[]): ClassDecorator {
  return (target: any) => {
    types.forEach((type) => {
      registerExceptionType(type, target as any);
    });
    registerProvider({
      provide: target,
      useClass: target
    });
  };
}
