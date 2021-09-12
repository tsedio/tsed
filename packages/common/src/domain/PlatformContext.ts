import {ContextMethods, DIContext, DIContextOptions} from "@tsed/di";
import {IncomingMessage, ServerResponse} from "http";
import {EndpointMetadata} from "./EndpointMetadata";
import {PlatformApplication} from "../services/PlatformApplication";
import {PlatformRequest} from "../services/PlatformRequest";
import {PlatformResponse} from "../services/PlatformResponse";

declare global {
  namespace TsED {
    export interface Context extends PlatformContext {}
  }
}

export interface PlatformContextOptions extends DIContextOptions {
  url: string;
  ignoreUrlPatterns?: any[];
  response?: PlatformResponse;
  request?: PlatformRequest;
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
  /**
   *
   */
  public readonly url: string;

  #ignoreUrlPatterns: RegExp[] = [];

  constructor({response, request, endpoint, url, ignoreUrlPatterns = [], ...options}: PlatformContextOptions) {
    super({
      ...options,
      ignoreLog: () => {
        return this.#ignoreUrlPatterns.find((reg) => !!this.url.match(reg));
      }
    });

    this.url = url;

    endpoint && (this.endpoint = endpoint);

    this.#ignoreUrlPatterns = ignoreUrlPatterns.map((pattern: string | RegExp) =>
      typeof pattern === "string" ? new RegExp(pattern, "gi") : pattern
    );

    if (response) {
      this.response = response;
      this.container.set(PlatformResponse, response);
    }

    if (request) {
      this.request = request;
      this.container.set(PlatformRequest, request);
    }

    this.container.set(PlatformContext, this);
  }

  get app() {
    return this.injector.get<PlatformApplication>(PlatformApplication)!;
  }

  async destroy() {
    await super.destroy();
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
    return !this.request || !this.response;
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
