import {toMap, Type} from "@tsed/core";
import {InjectorService, ProviderOpts, setLoggerConfiguration} from "@tsed/di";
import {$log} from "@tsed/logger";

import {PlatformConfiguration} from "../config/services/PlatformConfiguration.js";
import {Platform} from "../services/Platform.js";
import {PlatformAdapter} from "../services/PlatformAdapter.js";
import {PlatformApplication} from "../services/PlatformApplication.js";
import {PlatformHandler} from "../services/PlatformHandler.js";
import {PlatformRequest} from "../services/PlatformRequest.js";
import {PlatformResponse} from "../services/PlatformResponse.js";

$log.name = "TSED";

const DEFAULT_PROVIDERS = [
  {provide: PlatformHandler},
  {provide: PlatformResponse},
  {provide: PlatformRequest},
  {provide: PlatformApplication},
  {provide: Platform}
];

interface CreateInjectorOptions {
  adapter?: Type<PlatformAdapter<any>>;
  settings?: Partial<TsED.Configuration>;
}

export function createInjector({adapter, settings = {}}: CreateInjectorOptions) {
  const injector = new InjectorService();
  injector.addProvider(PlatformConfiguration);

  injector.settings = injector.invoke(PlatformConfiguration);
  injector.logger = $log;
  injector.settings.set(settings);

  if (adapter) {
    injector.addProvider(PlatformAdapter, {
      useClass: adapter
    });
  }

  injector.invoke(PlatformAdapter);
  injector.alias(PlatformAdapter, "PlatformAdapter");

  setLoggerConfiguration(injector);

  const instance = injector.get<PlatformAdapter>(PlatformAdapter)!;

  instance.providers = [...DEFAULT_PROVIDERS, ...instance.providers];

  toMap<any, ProviderOpts>(instance.providers, "provide").forEach((provider, token) => {
    injector.addProvider(token, provider);
  });

  injector.invoke(PlatformApplication);

  return injector;
}
