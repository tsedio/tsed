import {toMap, Type} from "@tsed/core";
import {InjectorService, ProviderOpts, setLoggerConfiguration} from "@tsed/di";
import {$log} from "@tsed/logger";
import {PlatformConfiguration} from "../config/services/PlatformConfiguration";
import {Platform} from "../services/Platform";
import {PlatformAdapter} from "../services/PlatformAdapter";
import {PlatformApplication} from "../services/PlatformApplication";
import {PlatformHandler} from "../services/PlatformHandler";
import {PlatformRequest} from "../services/PlatformRequest";
import {PlatformResponse} from "../services/PlatformResponse";
import {PlatformRouter} from "../services/PlatformRouter";

$log.name = "TSED";

const DEFAULT_PROVIDERS = [
  {provide: PlatformHandler},
  {provide: PlatformResponse},
  {provide: PlatformRequest},
  {provide: PlatformRouter},
  {provide: PlatformApplication},
  {provide: Platform}
];

interface CreateInjectorOptions {
  adapter?: Type<PlatformAdapter<any, any>>;
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

  setLoggerConfiguration(injector);

  const instance = injector.get<PlatformAdapter>(PlatformAdapter)!;

  instance.providers = [...DEFAULT_PROVIDERS, ...instance.providers];

  toMap<any, ProviderOpts>(instance.providers, "provide").forEach((provider, token) => {
    injector.addProvider(token, provider);
  });

  injector.invoke(PlatformApplication);

  return injector;
}
