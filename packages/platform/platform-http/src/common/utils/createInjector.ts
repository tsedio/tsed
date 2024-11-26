import {toMap, Type} from "@tsed/core";
import {injector, ProviderOpts, setLoggerConfiguration} from "@tsed/di";
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
  {token: PlatformHandler},
  {token: PlatformResponse},
  {token: PlatformRequest},
  {token: PlatformApplication},
  {token: Platform}
];

interface CreateInjectorOptions {
  adapter?: Type<PlatformAdapter<any>>;
  settings?: Partial<TsED.Configuration>;
}

export function createInjector({adapter, settings = {}}: CreateInjectorOptions) {
  const inj = injector();
  inj.addProvider(PlatformConfiguration);

  inj.settings = inj.invoke(PlatformConfiguration);
  inj.logger = $log;
  inj.settings.set(settings);

  if (adapter) {
    inj.addProvider(PlatformAdapter, {
      useClass: adapter
    });
  }

  inj.invoke(PlatformAdapter);
  inj.alias(PlatformAdapter, "PlatformAdapter");

  setLoggerConfiguration();

  const instance = inj.get<PlatformAdapter>(PlatformAdapter)!;

  instance.providers = [...DEFAULT_PROVIDERS, ...instance.providers];

  toMap<any, ProviderOpts>(instance.providers, "provide").forEach((provider, token) => {
    inj.addProvider(token, provider);
  });

  DEFAULT_PROVIDERS.map((provider) => inj.get(provider.token));

  return inj;
}
