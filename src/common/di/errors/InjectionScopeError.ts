import {nameOf, Type} from "@tsed/core";

export class InjectionScopeError extends Error {
  name = "INJECTION_SCOPE_ERROR";

  constructor(target: Type<any>, parentClass: string) {
    super(
      `Service of type ${nameOf(target)} can not be injected as it is request scoped, while ${nameOf(parentClass)} is singleton scoped`
    );
  }
}
