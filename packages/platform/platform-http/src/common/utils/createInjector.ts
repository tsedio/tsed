import {injector, setLoggerConfiguration} from "@tsed/di";
import {$log} from "@tsed/logger";

import {PlatformConfiguration} from "../config/services/PlatformConfiguration.js";
import {adapter as $adapter} from "../fn/adapter.js";
import {PlatformAdapter} from "../services/PlatformAdapter.js";

$log.name = "TSED";

export function createInjector(settings: Partial<TsED.Configuration>) {
  const inj = injector();
  inj.addProvider(PlatformConfiguration);

  inj.settings = inj.invoke(PlatformConfiguration);
  inj.logger = $log;
  inj.settings.set(settings);

  setLoggerConfiguration();

  $adapter(settings.adapter);

  inj.invoke(PlatformAdapter);

  return inj;
}
