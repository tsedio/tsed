import {Env, Store, Type} from "@tsed/core";
import {mergeMount, ProviderScope, ProviderType} from "@tsed/di";

export function getConfiguration(configuration: any = {}, module: Type<any> | null = null) {
  if (configuration.$$resolved) {
    return configuration;
  }

  const store = module ? Store.from(module).get("configuration") || {} : {};
  const env = configuration.env || store.env || (process.env.NODE_ENV as Env) || Env.DEV;

  return {
    $$resolved: true,
    env,
    httpPort: 8080,
    httpsPort: false,
    ...store,
    ...configuration,
    scopes: {
      [ProviderType.CONTROLLER]: ProviderScope.SINGLETON,
      ...store.scopes,
      ...configuration.scopes
    },
    mount: mergeMount(store.mount, configuration.mount),
    logger: {
      debug: false,
      level: env === Env.TEST ? "off" : "info",
      logRequest: true,
      ...store.logger,
      ...configuration.logger,
      jsonIndentation: process.env.NODE_ENV === Env.PROD ? 0 : 2
    }
  };
}
