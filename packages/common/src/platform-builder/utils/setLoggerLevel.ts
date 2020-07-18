import {InjectorService} from "@tsed/di";

/**
 * @ignore
 * @param injector
 */
export function setLoggerLevel(injector: InjectorService) {
  const level = injector.settings.logger.level;

  /* istanbul ignore next */
  if (level && injector.settings.env !== "test") {
    injector.logger.level = level;
  }
}
