import {ContextMethods, DIContext, DIContextOptions} from "@tsed/di";
import {IncomingMessage, ServerResponse} from "http";
import {EndpointMetadata} from "@tsed/schema";
import {PlatformApplication} from "../services/PlatformApplication";
import {PlatformRequest} from "../services/PlatformRequest";
import {PlatformResponse} from "../services/PlatformResponse";

declare global {
  namespace TsED {
    export interface Context extends PlatformContext {}
  }
}

export interface PlatformContextOptions extends DIContextOptions {
  event: {
    response?: ServerResponse;
    request?: IncomingMessage;
  };
  ignoreUrlPatterns?: any[];
  endpoint?: EndpointMetadata;
}

export class PlatformContext extends DIContext implements ContextMethods {
  /**
   * The current @@EndpointMetadata@@ resolved by Ts.ED during the request.
   */
  public endpoint: EndpointMetadata;
  /**
   * The data return by the previous endpoint if you use multiple handler on the same route. By default data is empty.
   */
  public data: any;
  /**
   * The current @@PlatformResponse@@.
   */
  public response: PlatformResponse;
  /**
   * The current @@PlatformRequest@@.
   */
  public request: PlatformRequest;

  private ignoreUrlPatterns: RegExp[] = [];

  constructor({
    event,
    endpoint,
    ignoreUrlPatterns = [],
    ResponseKlass = PlatformResponse,
    RequestKlass = PlatformRequest,
    ...options
  }: PlatformContextOptions) {
    super({
      ...options,
      ignoreLog: () => {
        return this.ignoreUrlPatterns.find((reg) => !!this.url.match(reg));
      }
    });

    endpoint && (this.endpoint = endpoint);

    this.ignoreUrlPatterns = ignoreUrlPatterns.map((pattern: string | RegExp) =>
      typeof pattern === "string" ? new RegExp(pattern, "gi") : pattern
    );

    this.response = new ResponseKlass(event, this);
    this.request = new RequestKlass(event, this);

    this.response.request = this.request;
    this.request.response = this.response;

    this.request.request.$ctx = this;
    this.request.request.id = this.id;
    this.logger.url = this.url;

    this.container.set(PlatformResponse, this.response);
    this.container.set(PlatformRequest, this.request);
    this.container.set(PlatformContext, this);

    this.response.setHeader("x-request-id", this.id);
  }

  get url() {
    return this.request.url;
  }

  get app() {
    return this.injector.get<PlatformApplication>(PlatformApplication)!;
  }

  async destroy() {
    await super.destroy();

    delete this.request?.request?.$ctx;

    this.response.destroy();
    this.request.destroy();

    // @ts-ignore
    delete this.endpoint;
    // @ts-ignore
    delete this.response;
    // @ts-ignore
    delete this.request;
  }

  isDone() {
    if (!this.request || !this.response) {
      return true;
    }

    if (this.request?.isAborted()) {
      return true;
    }

    return this.response?.isDone();
  }

  /**
   * Return the framework request instance (Express, Koa, etc...)
   */
  getRequest<Req = any>(): Req {
    return this.request.getRequest<Req>();
  }

  /**
   * Return the framework response instance (Express, Koa, etc...)
   */
  getResponse<Res = any>(): Res {
    return this.response.getResponse<Res>();
  }

  /**
   * Get Node.js request
   */
  getReq(): IncomingMessage {
    return this.request.getReq();
  }

  /**
   * Get Node.js response
   */
  getRes(): ServerResponse {
    return this.response.getRes();
  }

  /**
   * Return the original application instance.
   */
  getApp<T = any>(): T {
    return this.app.getApp() as any;
  }
}
