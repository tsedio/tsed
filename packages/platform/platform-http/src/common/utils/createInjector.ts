import {toMap} from "@tsed/core";
import {injector, ProviderOpts, setLoggerConfiguration} from "@tsed/di";
import {$log} from "@tsed/logger";

import {PlatformConfiguration} from "../config/services/PlatformConfiguration.js";
import {adapter as $adapter} from "../fn/adapter.js";
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

export function createInjector(settings: Partial<TsED.Configuration>) {
  const inj = injector();
  inj.addProvider(PlatformConfiguration);

  inj.settings = inj.invoke(PlatformConfiguration);
  inj.logger = $log;
  inj.settings.set(settings);

  setLoggerConfiguration();

  const adapterToken = $adapter(settings.adapter);

  inj
    .addProvider(PlatformAdapter, {
      useClass: adapterToken
    })
    .alias(PlatformAdapter, "PlatformAdapter");

  const adapter = inj.invoke(PlatformAdapter);

  inj.settings.set("PLATFORM_NAME", settings.PLATFORM_NAME || adapter.NAME);

  const instance = inj.get<PlatformAdapter>(PlatformAdapter)!;

  toMap<any, ProviderOpts>(instance.providers, "token").forEach((provider, token) => {
    inj.addProvider(token, provider);
  });

  DEFAULT_PROVIDERS.map((provider) => inj.get(provider.token));

  return inj;
}
