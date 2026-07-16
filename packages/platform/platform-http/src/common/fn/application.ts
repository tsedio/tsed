import type {PlatformApplication} from "../services/PlatformApplication.js";
import {injector} from "@tsed/di";

/**
 * Return the injectable Application instance.
 * @note Application is only available after PlatformExpress/PlatformKoa instance creation.
 */
export function application<App = TsED.Application>() {
  return injector().get<PlatformApplication<App>>("PlatformApplication")!;
}
