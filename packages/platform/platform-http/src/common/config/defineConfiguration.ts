import "./PlatformConfiguration.js";
import {Env, Store, isBoolean} from "@tsed/core";
import {JsonMapperGlobalOptions, JsonMapperSettings} from "@tsed/json-mapper";
import {ProviderScope, ProviderType, configuration, mergeMount} from "@tsed/di";
import {$on} from "@tsed/hooks";

export function defineConfiguration(input: Partial<TsED.Configuration> = {}) {
  if ((input as any).$$resolved) {
    return input;
  }

  const store = input.rootModule ? Store.from(input.rootModule).get("configuration") || {} : {};
  const env = input.env || store.env || (process.env.NODE_ENV as Env) || Env.DEV;

  const finalConfig = {
    $$resolved: true,
    rootDir: process.cwd(),
    env,
    httpPort: 8080,
    httpsPort: false,
    jsonMapper: JsonMapperSettings,
    ...store,
    ...input,
    scopes: {
      [ProviderType.CONTROLLER]: ProviderScope.SINGLETON,
      ...store.scopes,
      ...input.scopes
    },
    mount: mergeMount(store.mount, input.mount),
    logger: {
      debug: false,
      level: env === Env.TEST ? "off" : "info",
      logRequest: true,
      ...store.logger,
      ...input.logger,
      jsonIndentation: process.env.NODE_ENV === Env.PROD ? 0 : 2
    }
  };

  configuration().set(finalConfig);

  return finalConfig;
}

$on("$alterConfig:jsonMapper", (options: JsonMapperGlobalOptions) => {
  JsonMapperSettings.strictGroups = Boolean(options.strictGroups);
  JsonMapperSettings.disableUnsecureConstructor = Boolean(options.disableUnsecureConstructor);
  JsonMapperSettings.additionalProperties = Boolean(
    isBoolean(options.additionalProperties) ? options.additionalProperties : options.additionalProperties === "accept"
  );

  return options;
});
