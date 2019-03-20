import {nameOf, Type} from "@tsed/core";

export class InjectionError extends Error {
  name = "INJECTION_ERROR";

  constructor(target: Type<any>, serviceName: string, message = "not found", public origin: any = {}) {
    super(
      `Service ${nameOf(target)} > ${serviceName} ${message}.${
        origin.message ? "\nOrigin: " + origin.message + "[" + origin.stack + "]" : ""
      }`
    );
  }
}
