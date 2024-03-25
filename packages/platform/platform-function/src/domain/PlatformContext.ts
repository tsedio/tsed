import {DIContext} from "@tsed/di";
import {JsonEntityStore} from "@tsed/schema";
import {v4} from "uuid";
import {PlatformContextOpts} from "./PlatformContextOpts";
import {PlatformRequest} from "./PlatformRequest";
import {PlatformResponse} from "./PlatformResponse";


export class PlatformContext<Opts extends PlatformContextOpts = PlatformContextOpts> extends DIContext<Opts> {
  static PlatformRequest: typeof PlatformRequest = PlatformRequest;
  static PlatformResponse: typeof PlatformResponse = PlatformResponse;

  readonly response: PlatformResponse;
  readonly request: PlatformRequest;
  readonly handler: JsonEntityStore;

  constructor(options: Opts & {handler: JsonEntityStore}) {
    super({
      maxStackSize: 0,
      ...options,
      id: options.id || v4().replace(/-/gi, ""),
      url: options.url || '',
      body: options.body || {},
      headers: options.headers || {},
      method: options.method || '',
      protocol: options.protocol || '',
      secure: options.secure || '',
      query: options.query || {},
      params: options.params || {},
    });

    this.handler = options.handler;
    this.request = new PlatformContext.PlatformRequest<Opts>(this);
    this.response = new PlatformContext.PlatformResponse<Opts>(this);
  }

  async destroy() {
    await super.destroy();
    this.response.destroy();
  }

  isDone() {
    return this.response.isDone();
  }
}
