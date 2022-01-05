import {InjectorService, IProvider, setLoggerLevel} from "@tsed/di";
import {$log} from "@tsed/logger";
import {toMap, Type} from "@tsed/core";
import {PlatformConfiguration} from "../config/services/PlatformConfiguration";
import {PlatformHandler} from "../services/PlatformHandler";
import {PlatformResponse} from "../services/PlatformResponse";
import {PlatformRouter} from "../services/PlatformRouter";
import {PlatformApplication} from "../services/PlatformApplication";
import {Platform} from "../services/Platform";
import {PlatformRequest} from "../services/PlatformRequest";
import {PlatformAdapter} from "../services/PlatformAdapter";

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
  adapter: Type<PlatformAdapter<any, any>>;
  settings?: Partial<TsED.Configuration>;
}

export function createInjector({adapter, settings = {}}: CreateInjectorOptions) {
  const injector = new InjectorService();
  injector.addProvider(PlatformConfiguration);

  injector.settings = injector.invoke(PlatformConfiguration);
  injector.logger = $log;
  injector.settings.set(settings);

  setLoggerLevel(injector);

  const adapterInstance = new adapter(injector);

  injector
    .addProvider(PlatformAdapter, {
      useValue: adapterInstance
    })
    .invoke(PlatformAdapter);

  const providers = [...DEFAULT_PROVIDERS, ...adapterInstance.providers];

  toMap<any, IProvider>(providers, "provide").forEach((provider, token) => {
    injector.addProvider(token, provider);
  });

  injector.invoke(PlatformApplication);

  return injector;
}
