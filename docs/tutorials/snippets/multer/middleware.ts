import { BodyParams, Middleware, MiddlewareMethods } from '@tsed/platform-http';

@Middleware({ priority: 11 })
export class CustomMiddleware implements MiddlewareMethods {
  public use(@BodyParams('data') data: any) {
    // data will now be available
  }
}
