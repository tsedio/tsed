import {InjectorService, LocalsContainer} from "@tsed/di";
import {IncomingMessage, ServerResponse} from "http";
import {EndpointMetadata} from "../../mvc/models/EndpointMetadata";
import {PlatformApplication} from "../services/PlatformApplication";
import {PlatformRequest} from "../services/PlatformRequest";
import {PlatformResponse} from "../services/PlatformResponse";
import {RequestLogger, RequestLoggerOptions} from "./RequestLogger";

declare global {
  namespace TsED {
    export interface Context extends PlatformContext {}
  }
}

export interface RequestContextOptions extends Omit<RequestLoggerOptions, "dateStart"> {
  id: string;
  logger: any;
  injector?: InjectorService;
  response?: PlatformResponse;
  request?: PlatformRequest;
  endpoint?: EndpointMetadata;
}

export class PlatformContext extends Map<any, any> {
  /**
   * Request id generated by @@contextMiddleware@@.
   *
   * ::: tip
   * By default Ts.ED generate uuid like that `uuidv4().replace(/-/gi, ""))`.
   * Dash are removed to simplify tracking logs in Kibana
   * :::
   *
   * ::: tip
   * Request id can by customized by changing the server configuration.
   *
   * ```typescript
   * @Configuration({
   *   logger: {
   *     reqIdBuilder: createUniqId // give your own id generator function
   *   }
   * })
   * class Server {
   *
   * }
   * ```
   * :::
   *
   */
  readonly id: string;
  /**
   * Date when request have been handled by the server. @@RequestLogger@@ use this date to log request duration.
   */
  readonly dateStart: Date = new Date();
  /**
   * The request container used by the Ts.ED DI. It contain all services annotated with `@Scope(ProviderScope.REQUEST)`
   */
  public container = new LocalsContainer<any>();
  /**
   * The current @@EndpointMetadata@@ resolved by Ts.ED during the request.
   */
  public endpoint: EndpointMetadata;
  /**
   * The data return by the previous endpoint if you use multiple handler on the same route. By default data is empty.
   */
  public data: any;
  /**
   * Logger attached to the context request.
   */
  public logger: RequestLogger;
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
  public injector: InjectorService;

  constructor({id, injector, logger, response, request, endpoint, ...options}: RequestContextOptions) {
    super();
    this.id = id;

    injector && (this.injector = injector);
    response && (this.response = response);
    request && (this.request = request);
    endpoint && (this.endpoint = endpoint);

    this.logger = new RequestLogger(logger, {
      ...options,
      id,
      dateStart: this.dateStart
    });

    if (this.response) {
      this.container.set(PlatformResponse, this.response);
    }

    if (this.response) {
      this.container.set(PlatformRequest, this.request);
    }

    this.container.set(PlatformContext, this);
  }

  get env() {
    return this.injector.settings.env;
  }

  get app() {
    return this.injector.get<PlatformApplication>(PlatformApplication)!;
  }

  async destroy() {
    await this.container.destroy();
    this.logger.destroy();
    this.response.destroy();
    this.request.destroy();
    // @ts-ignore
    delete this.container;
    // @ts-ignore
    delete this.logger;
    // @ts-ignore
    delete this.injector;
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

  async emit(eventName: string, ...args: any[]) {
    return this.injector?.emit(eventName, ...args);
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
