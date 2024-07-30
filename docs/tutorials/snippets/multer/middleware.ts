import { BodyParams, Middleware, MiddlewareMethods } from '@tsed/common';

@Middleware({ priority: 11 })
export class CustomMiddleware implements MiddlewareMethods {
  public use(@BodyParams('data') data: any) {
    // data will now be available
  }
}