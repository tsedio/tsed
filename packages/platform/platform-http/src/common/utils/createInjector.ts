import {attachLogger, injector} from "@tsed/di";
import {adapter as $adapter} from "../fn/adapter.js";
import {$log} from "@tsed/logger";
import {Platform} from "../services/Platform.js";
import {PlatformAdapter} from "../services/PlatformAdapter.js";
import {PlatformHandler} from "../services/PlatformHandler.js";

$log.name = "TSED";

export function createInjector(settings: Partial<TsED.Configuration>) {
  const inj = injector();
  inj.settings.set(settings);

  attachLogger($log);

  $adapter(settings.adapter);

  inj.invoke(PlatformAdapter);
  inj.invoke(Platform);
  inj.invoke(PlatformHandler);

  return inj;
}
