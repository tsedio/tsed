import {Type} from "@tsed/core";
import {registerExceptionType} from "../domain/ExceptionTypesContainer";

/**
 * Register a new class to handle an specific exception.
 * @decorator
 * @param types
 */
export function Catch(...types: Type<Error | any>[]) {
  return (target: any) => {
    types.forEach((type) => {
      registerExceptionType(type, target as any);
    });
  };
}
