import {cleanObject} from "@tsed/core";
import type {BaseContext} from "@tsed/di";

export function defaultLogResponse($ctx: BaseContext) {
  if ($ctx.response.statusCode >= 400) {
    const error = $ctx.error as any | undefined;

    $ctx.logger.error({
      event: "request.end",
      status: $ctx.response.statusCode,
      status_code: String($ctx.response.statusCode),
      state: "KO",
      ...cleanObject({
        error_name: error?.name || error?.code,
        error_message: error?.message,
        error_errors: error?.errors,
        error_stack: error?.stack,
        error_body: error?.body,
        error_headers: error?.headers
      })
    });
  } else {
    $ctx.logger.info({
      event: "request.end",
      status: $ctx.response.statusCode,
      status_code: String($ctx.response.statusCode),
      state: "OK"
    });
  }
}
