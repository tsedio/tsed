import type {InvokeOptions} from "../interfaces/InvokeOptions.js";
import {InjectorService} from "../services/InjectorService.js";
import {$injector} from "./injector.js";

export function injectMany<T>(token: string | symbol, opts?: Partial<Pick<InvokeOptions, "useOpts" | "rebuild" | "locals">>): T[] {
  return $injector().getMany<T>(token, opts?.locals || InjectorService.getLocals(), opts);
}
