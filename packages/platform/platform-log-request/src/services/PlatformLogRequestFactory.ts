import {type BaseContext, Configuration, registerProvider} from "@tsed/di";

import {defaultAlterLog} from "../utils/defaultAlterLog.js";
import {defaultLogResponse} from "../utils/defaultLogResponse.js";

function factory(configuration: Configuration) {
  const {
    logRequest = true,
    alterLog = defaultAlterLog,
    onLogResponse = defaultLogResponse
  } = configuration.get<TsED.LoggerConfiguration>("logger");

  return logRequest
    ? {
        alterLog,
        onLogResponse
      }
    : null;
}

export const PlatformLogRequestFactory = Symbol.for("PLATFORM:LOGGER:REQUEST");
export type PlatformLogRequestFactory = ReturnType<typeof factory>;

registerProvider({
  provide: PlatformLogRequestFactory,
  deps: [Configuration],
  useFactory: factory,
  hooks: {
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
  }
});
