import {type BaseContext, constant, injectable} from "@tsed/di";

import {defaultAlterLog} from "../utils/defaultAlterLog.js";
import {defaultLogResponse} from "../utils/defaultLogResponse.js";

function factory() {
  const {
    logRequest = true,
    alterLog = defaultAlterLog,
    onLogResponse = defaultLogResponse
  } = constant<TsED.LoggerConfiguration>("logger", {});

  return logRequest
    ? {
        alterLog,
        onLogResponse
      }
    : null;
}

export type PlatformLogRequestFactory = ReturnType<typeof factory>;

export const PlatformLogRequestFactory = injectable(Symbol.for("PLATFORM:LOGGER:REQUEST"))
  .factory(factory)
  .hooks({
    $onRequest(instance: ReturnType<typeof factory>, $ctx: BaseContext) {
      if (instance) {
        $ctx.logger.alterLog((obj: any, level) => instance.alterLog(level, obj, $ctx));
        $ctx.logStarted = true;
      }
    },
    $onResponse(instance: ReturnType<typeof factory>, $ctx: BaseContext) {
      if (instance && $ctx.logStarted) {
        instance.onLogResponse($ctx);
      }
    }
  })
  .token();
