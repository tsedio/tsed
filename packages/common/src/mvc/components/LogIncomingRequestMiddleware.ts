import {applyBefore} from "@tsed/core";
import * as Express from "express";
import {$log} from "ts-log-debug";
import {ILoggerSettings} from "../../config/interfaces/IServerSettings";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {Req} from "../../filters/decorators/request";
import {Res} from "../../filters/decorators/response";
import {Middleware} from "../decorators/class/middleware";
import {IMiddleware} from "../interfaces";

/**
 * @middleware
 */
@Middleware()
export class LogIncomingRequestMiddleware implements IMiddleware {
  private static DEFAULT_FIELDS = ["reqId", "method", "url", "duration"];

  private AUTO_INCREMENT_ID = 1;
  private loggerSettings: ILoggerSettings;
  private fields: string[];
  private reqIdBuilder: () => number;
  private debug: boolean;

  // tslint:disable-next-line: no-unused-variable
  constructor(serverSettingsService: ServerSettingsService) {
    this.loggerSettings = serverSettingsService.logger as ILoggerSettings;
    this.reqIdBuilder = this.loggerSettings.reqIdBuilder || (() => this.AUTO_INCREMENT_ID++);
    this.fields = this.loggerSettings.requestFields || LogIncomingRequestMiddleware.DEFAULT_FIELDS;
    this.debug = serverSettingsService.debug;
  }

  /**
   * Handle the request.
   * @param {e.Request} request
   * @param {e.Response} response
   */
  public use(@Req() request: Express.Request, @Res() response: Express.Response): void {
    this.configureRequest(request);

    this.onLogStart(request);

    applyBefore(response, "end", () => this.onLogEnd(request, response));
  }

  /**
   * The separate onLogStart() function will allow developer to overwrite the initial request log.
   * @param {e.Request} request
   */
  protected onLogStart(request: Express.Request) {
    request.log.debug({event: "start"});
  }

  /**
   * Attach all informations that will be necessary to log the request. Attach a new `request.log` object.
   * @param request
   */
  protected configureRequest(request: Express.Request) {
    request.id = String(request.id ? request.id : this.reqIdBuilder());
    request.tsedReqStart = new Date();

    const {ignoreUrlPatterns = []} = this.loggerSettings;

    const regs = ignoreUrlPatterns.map((pattern: string | RegExp) => (typeof pattern === "string" ? new RegExp(pattern, "gi") : pattern));

    const verbose = (req: Express.Request) => this.requestToObject(req);
    const info = (req: Express.Request) => this.minimalRequestPicker(req);

    const run = (cb: Function) => {
      const match = regs.find(reg => !!request.url.match(reg));

      return !match && cb();
    };

    request.log = {
      info: (obj: any) => run(() => $log.info(this.stringify(request, info)(obj))),
      debug: (obj: any) => run(() => $log.debug(this.stringify(request, verbose)(obj))),
      warn: (obj: any) => run(() => $log.warn(this.stringify(request, verbose)(obj))),
      error: (obj: any) => run(() => $log.error(this.stringify(request, verbose)(obj))),
      trace: (obj: any) => run(() => $log.trace(this.stringify(request, verbose)(obj)))
    };
  }

  /**
   * Return complete request info.
   * @param request
   * @returns {Object}
   */
  protected requestToObject(request: Express.Request): any {
    return {
      reqId: request.id,
      method: request.method,
      url: request.originalUrl || request.url,
      duration: this.getDuration(request),
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
  protected minimalRequestPicker(request: Express.Request): any {
    const info = this.requestToObject(request);

    return this.fields.reduce((acc: any, key: string) => {
      acc[key] = info[key];

      return acc;
    }, {});
  }

  /**
   * Return the duration between the time when LogIncomingRequest has handle the request and now.
   * @param request
   * @returns {number}
   */
  protected getDuration(request: Express.Request): number {
    return new Date().getTime() - request.tsedReqStart.getTime();
  }

  /**
   * Stringify a request to JSON.
   * @param request
   * @param propertySelector
   * @returns {(scope: any) => string}
   */
  protected stringify(request: Express.Request, propertySelector: (e: Express.Request) => any): (scope: any) => string {
    return (scope: any = {}) => {
      if (typeof scope === "string") {
        scope = {message: scope};
      }
      scope = Object.assign(scope, propertySelector(request));
      try {
        return JSON.stringify(scope, null, this.loggerSettings.jsonIndentation);
      } catch (er) {
        $log.error({error: er});
      }

      return "";
    };
  }

  /**
   * Called when the `request.end()` is called by Express.
   * @param request
   * @param response
   */
  protected onLogEnd(request: Express.Request, response: Express.Response) {
    setImmediate(() => {
      /* istanbul ignore else */
      if (request.id) {
        if (this.loggerSettings.logRequest) {
          request.log.info({status: response.statusCode});
        }

        if (this.debug) {
          request.log.debug({
            status: response.statusCode,
            data: request.getStoredData && request.getStoredData()
          });
        }
        this.cleanRequest(request);
      }
    });
  }

  /**
   * Remove all data that added with `LogIncomingRequest.configureRequest()`.
   * @param request
   */
  protected cleanRequest(request: Express.Request) {
    delete request.id;
    delete request.tagId;
    delete request.tsedReqStart;
    request.log = {
      info: () => {},
      debug: () => {},
      warn: () => {},
      error: () => {},
      trace: () => {}
    };
  }
}
