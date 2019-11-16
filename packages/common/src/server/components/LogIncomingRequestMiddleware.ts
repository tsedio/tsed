import {InjectorService} from "@tsed/di";
import {IMiddleware, Middleware, Req, Res} from "../../mvc";

/**
 * @middleware
 */
@Middleware()
export class LogIncomingRequestMiddleware implements IMiddleware {
  protected static DEFAULT_FIELDS = ["reqId", "method", "url", "duration"];

  // tslint:disable-next-line: no-unused-variable
  constructor(protected injector: InjectorService) {
  }

  /**
   * Handle the request.
   * @param {e.Request} request
   */
  public use(@Req() request: Req): void {
    this.configureRequest(request);
    this.onLogStart(request);
  }

  $onResponse(request: Req, response: Res) {
    this.onLogEnd(request, response);
  }

  /**
   * The separate onLogStart() function will allow developer to overwrite the initial request log.
   * @param {e.Request} request
   */
  protected onLogStart(request: Req) {
    const {debug, logRequest, logStart} = this.injector.settings.logger;

    if (logStart !== false) {
      if (debug) {
        request.ctx.logger.debug({
          event: "request.start"
        });
      } else if (logRequest) {
        request.ctx.logger.info({
          event: "request.start"
        });
      }
    }
  }

  /**
   * Called when the `$onResponse` is called by Ts.ED (through Express.end).
   * @param request
   * @param response
   */
  protected onLogEnd(request: Req, response: Res) {
    const {debug, logRequest, logEnd} = this.injector.settings.logger;

    if (logEnd !== false) {
      if (debug) {
        request.ctx.logger.debug({
          event: "request.end",
          status: response.statusCode,
          data: request.ctx.data
        });
      } else if (logRequest) {
        request.ctx.logger.info({
          event: "request.end",
          status: response.statusCode
        });
      }
    }
    request.ctx.logger.flush();
  }

  /**
   * Attach all information that will be necessary to log the request. Attach a new `request.log` object.
   * @param request
   */
  protected configureRequest(request: Req) {
    const minimalInfo = this.minimalRequestPicker(request);
    const requestObj = this.requestToObject(request);

    request.ctx.logger.minimalRequestPicker = (obj: any) => ({...minimalInfo, ...obj});
    request.ctx.logger.completeRequestPicker = (obj: any) => ({...requestObj, ...obj});
  }

  /**
   * Return complete request info.
   * @param request
   * @returns {Object}
   */
  protected requestToObject(request: Req): any {
    return {
      method: request.method,
      url: request.originalUrl || request.url,
      headers: request.headers,
      body: request.body,
      query: request.query,
      params: request.params
    };
  }

  /**
   * Return a filtered request from global configuration.
   * @param request
   * @returns {Object}
   */
  protected minimalRequestPicker(request: Req): any {
    const {requestFields = LogIncomingRequestMiddleware.DEFAULT_FIELDS} = this.injector.settings.logger;
    const info = this.requestToObject(request);

    return requestFields.reduce((acc: any, key: string) => {
      acc[key] = info[key];

      return acc;
    }, {});
  }
}
