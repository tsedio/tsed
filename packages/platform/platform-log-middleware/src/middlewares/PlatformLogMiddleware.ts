import {cleanObject} from "@tsed/core";
import {Constant} from "@tsed/di";
import {Middleware, MiddlewareMethods} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";

import type {LoggerRequestFields} from "../domain/PlatformLogMiddlewareSettings.js";

/**
 * @middleware
 * @platform
 */
@Middleware()
export class PlatformLogMiddleware implements MiddlewareMethods {
  @Constant("logger.requestFields", ["reqId", "method", "url", "duration", "route"])
  protected requestFields: LoggerRequestFields;

  @Constant("logger.logRequest", true)
  protected logRequest: boolean;

  @Constant("logger.logStart", true)
  protected logStart: boolean;

  @Constant("logger.logEnd", true)
  protected logEnd: boolean;

  @Constant("logger.level")
  protected logLevel: string;

  get settings() {
    return this;
  }

  /**
   * Handle the request.
   */
  public use(@Context() ctx: Context): void {
    this.configureRequest(ctx);
    this.onLogStart(ctx);

    ctx.response.onEnd(() => this.onLogEnd(ctx));
  }

  /**
   * Called when the `$onResponse` is called by Ts.ED (through Express.end).
   */
  onLogEnd(ctx: Context) {
    const {logRequest, logEnd, logLevel} = this.settings;
    const started = ctx.logStarted;

    if (logEnd && started) {
      if (ctx.response.statusCode >= 400) {
        const error = ctx.error as any | undefined;
        ctx.logger.error({
          event: "request.end",
          status: ctx.response.statusCode,
          status_code: String(ctx.response.statusCode),
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
        if (logLevel === "debug") {
          ctx.logger.debug({
            event: "request.end",
            status: ctx.response.statusCode,
            status_code: String(ctx.response.statusCode),
            data: ctx.data,
            state: "OK"
          });
        } else if (logRequest) {
          ctx.logger.info({
            event: "request.end",
            status: ctx.response.statusCode,
            status_code: String(ctx.response.statusCode),
            state: "OK"
          });
        }
      }
    }
  }

  /**
   * The separate onLogStart() function will allow developer to overwrite the initial request log.
   * @param ctx
   */
  protected onLogStart(ctx: Context) {
    const {logRequest, logLevel, logStart} = this.settings;

    ctx.logStarted = true;

    if (logStart) {
      if (logLevel === "debug") {
        ctx.logger.debug({
          event: "request.start"
        });
      } else if (logRequest) {
        ctx.logger.info({
          event: "request.start"
        });
      }
    }
  }

  /**
   * Attach all information that will be necessary to log the request. Attach a new `request.log` object.
   */
  protected configureRequest(ctx: Context) {
    ctx.logger.alterLog((obj: any, level, withRequest) => {
      switch (level) {
        case "info":
          return {...this.minimalRequestPicker(ctx), ...obj};
        case "debug":
          return {...this.requestToObject(ctx), ...obj};
        default:
          return {...this.requestToObject(ctx), ...obj};
      }
    });
  }

  /**
   * Return complete request info.
   * @returns {Object}
   * @param ctx
   */
  protected requestToObject(ctx: Context): any {
    const {request} = ctx;

    return {
      method: request.method,
      url: request.url,
      route: request.route || request.url,
      headers: request.headers,
      body: request.body,
      query: request.query,
      params: request.params
    };
  }

  /**
   * Return a filtered request from global configuration.
   * @returns {Object}
   * @param ctx
   */
  protected minimalRequestPicker(ctx: Context): any {
    const {requestFields} = this;
    const info = this.requestToObject(ctx);

    return requestFields!.reduce((acc: any, key: string) => {
      acc[key] = info[key];

      return acc;
    }, {});
  }
}
