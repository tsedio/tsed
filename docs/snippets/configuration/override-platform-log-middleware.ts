import {Context, OverrideProvider, PlatformLogMiddleware} from "@tsed/common";

@OverrideProvider(PlatformLogMiddleware)
export class CustomPlatformLogMiddleware extends PlatformLogMiddleware {
  public use(@Context() ctx: Context) {
    // do something

    return super.use(ctx); // required
  }

  protected requestToObject(ctx: Context) {
    const {request} = ctx;

    // NOTE: request => PlatformRequest. To get Express.Request use ctx.getRequest<Express.Request>();
    return {
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: request.body,
      query: request.query,
      params: request.params
    };
  }
}
