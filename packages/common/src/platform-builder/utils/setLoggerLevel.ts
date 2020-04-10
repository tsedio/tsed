import {InjectorService} from "@tsed/di";

export function setLoggerLevel(injector: InjectorService) {
  const level = injector.settings.logger.level;

  /* istanbul ignore next */
  if (level && injector.settings.env !== "test") {
    injector.logger.level = level;
  }
}
