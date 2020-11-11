import {InjectorService} from "../services/InjectorService";

/**
 * @ignore
 * @param injector
 */
export function setLoggerLevel(injector: InjectorService) {
  const level = injector.settings.logger?.level;

  if (level) {
    injector.logger.level = level;
  }
}
