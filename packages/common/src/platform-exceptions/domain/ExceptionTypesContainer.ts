import {Type} from "@tsed/core";
import type {ExceptionFilterMethods} from "../interfaces/ExceptionFilterMethods";

// tslint:disable-next-line:variable-name
const ExceptionTypesContainer: Map<Type<any> | Symbol, {token: Type<ExceptionFilterMethods>; instance: ExceptionFilterMethods}> = new Map();

export function registerExceptionType(type: Type<any>, token: Type<ExceptionFilterMethods>) {
  ExceptionTypesContainer.set(type, {token, instance: new token()});
}

export function getExceptionTypes(): Map<Type<any> | Symbol, ExceptionFilterMethods> {
  return new Map(
    Array.from(ExceptionTypesContainer.entries()).map(([key, {instance}]) => {
      return [key, instance];
    })
  );
}
