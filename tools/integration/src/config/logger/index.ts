import type {DILoggerOptions} from "@tsed/di";
import {$log} from "@tsed/logger";

import {isProduction} from "../envs/index.js";

if (isProduction) {
  $log.appenders.set("stdout", {
    type: "stdout",
    levels: ["info", "debug"],
    layout: {
      type: "json"
    }
  });

  $log.appenders.set("stderr", {
    levels: ["trace", "fatal", "error", "warn"],
    type: "stderr",
    layout: {
      type: "json"
    }
  });
}

export default <DILoggerOptions>{
  disableRoutesSummary: isProduction
};
