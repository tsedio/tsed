import "@tsed/logger-connect";
import {$log} from "@tsed/logger";
import {attachLogger} from "@tsed/di";
import {useLogger} from "@directus/api/logger/index";

const cmsLogger = useLogger();

function print(o: any) {
  if (o?.data?.length && typeof o?.data[0] === "string") {
    return o?.data[0];
  }

  return JSON.stringify(o, null, 2);
}

$log.appenders.clear();
$log.appenders.set("stdout", {
  type: "connect",
  levels: ["info", "warn", "error", "trace", "debug"],
  options: {
    logger: {
      info: (o: any) => (cmsLogger.info as any)(print(o)),
      warn: (o: any) => (cmsLogger.warn as any)(print(o)),
      debug: (o: any) => (cmsLogger.debug as any)(print(o)),
      trace: (o: any) => (cmsLogger.trace as any)(print(o)),
      error: (o: any) => (cmsLogger.error as any)(print(o))
    }
  }
});

attachLogger($log);
