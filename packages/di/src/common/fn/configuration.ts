import {Store} from "@tsed/core";

import {DIConfiguration} from "../services/DIConfiguration.js";
import {injector} from "./injector.js";

export function configuration(): TsED.DIConfiguration & DIConfiguration;
export function configuration(token: TokenProvidern): Partial<TsED.Configuration>;
export function configuration(token: TokenProvidern, configuration: Partial<TsED.Configuration>): Partial<TsED.Configuration>;
export function configuration(token?: TokenProvidern, configuration?: Partial<TsED.Configuration>) {
  if (token) {
    const store = Store.from(token);

    if (configuration) {
      store.set("configuration", configuration);
    }

    return store.get("configuration", configuration);
  }

  return injector().settings as TsED.DIConfiguration & DIConfiguration;
}
