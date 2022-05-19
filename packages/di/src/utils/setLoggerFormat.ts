import type {InjectorService} from "../services/InjectorService";

/**
 * @ignore
 * @param injector
 */
export function setLoggerFormat(injector: InjectorService) {
  const {level, format} = injector.settings.logger;

  if (level) {
    injector.logger.level = level;
  }

  if (format && injector.logger.appenders) {
    injector.logger.appenders.set("stdout", {
      type: "stdout",
      levels: ["info", "debug"],
      layout: {
        type: "pattern",
        pattern: format
      }
    });

    injector.logger.appenders.set("stderr", {
      levels: ["trace", "fatal", "error", "warn"],
      type: "stderr",
      layout: {
        type: "pattern",
        pattern: format
      }
    });
  }
}
