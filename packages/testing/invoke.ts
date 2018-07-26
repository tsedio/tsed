import {Type} from "@tsed/core";
import {loadInjector} from "./loadInjector";

export function invoke(target: Type<any>, providers: {provide: any | symbol; use: any}[]) {
  const injector = loadInjector();
  const locals = new Map();

  providers.forEach(p => {
    locals.set(p.provide, p.use);
  });

  return injector.invoke(target, locals);
}
