import {injector} from "../../common/index.js";
import {logger} from "../fn/logger.js";

/**
 * @ignore
 */
export function setLoggerFormat() {
  const {level, format} = injector().settings.logger;

  if (level) {
    injector().logger.level = level;
  }

  if (format && injector().logger.appenders) {
    logger().appenders.set("stdout", {
      type: "stdout",
      levels: ["info", "debug"],
      layout: {
        type: "pattern",
        pattern: format
      }
    });

    logger().appenders.set("stderr", {
      levels: ["trace", "fatal", "error", "warn"],
      type: "stderr",
      layout: {
        type: "pattern",
        pattern: format
      }
    });
  }
}
