import type {InvokeOptions} from "../interfaces/InvokeOptions.js";
import {injector} from "./injector.js";
import {localsContainer} from "./localsContainer.js";

export function injectMany<T>(token: string | symbol, opts?: Partial<Pick<InvokeOptions, "useOpts" | "rebuild" | "locals">>): T[] {
  return injector().getMany<T>(token, {...opts, locals: opts?.locals || localsContainer()});
}
