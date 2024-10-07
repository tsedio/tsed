import type {InvokeOptions} from "../interfaces/InvokeOptions.js";
import {TokenProvider} from "../interfaces/TokenProvider.js";
import {InjectorService} from "../services/InjectorService.js";
import {$injector} from "./injector.js";

export function inject<T>(token: TokenProvider<T>, opts?: Partial<Pick<InvokeOptions, "useOpts" | "rebuild" | "locals">>): T {
  return $injector().invoke(token, opts?.locals || InjectorService.getLocals(), opts);
}
