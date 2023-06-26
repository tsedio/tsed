import type {InjectorService} from "../../common/index";

/**
 * @ignore
 * @param injector
 */
export function setLoggerLevel(injector: InjectorService) {
  const {level} = injector.settings.logger;

  if (level) {
    injector.logger.level = level;
  }
}
