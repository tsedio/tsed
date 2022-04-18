import {deepMerge, Env, Store, Type} from "@tsed/core";
import {ProviderScope, ProviderType} from "@tsed/di";

export function getConfiguration(configuration: any = {}, module: Type<any> | null = null) {
  if (configuration.$$resolved) {
    return configuration;
  }

  const store = module ? Store.from(module).get("configuration") || {} : {};
  const env = configuration.env || store.env || (process.env.NODE_ENV as Env) || Env.DEV;

  const config = {
    $$resolved: true,
    exclude: ["**/*.spec.ts", "**/*.spec.js"],
    componentsScan: ["${rootDir}/mvc/**/*.ts", "${rootDir}/services/**/*.ts", "${rootDir}/middlewares/**/*.ts"],
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
    mount:
      store.mount || configuration.mount
        ? deepMerge(store.mount || {}, configuration.mount || {})
        : {
            "/rest": "${rootDir}/controllers/**/*.ts"
          },
    logger: {
      debug: false,
      level: env === Env.TEST ? "off" : "info",
      logRequest: true,
      ...store.logger,
      ...configuration.logger,
      jsonIndentation: process.env.NODE_ENV === Env.PROD ? 0 : 2
    }
  };

  if (!configuration.disableComponentsScan && store.componentsScan && configuration.componentsScan) {
    config.componentsScan = [...store.componentsScan, ...configuration.componentsScan];
  }

  return config;
}
