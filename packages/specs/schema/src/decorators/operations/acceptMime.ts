import {StoreSet, useDecorators} from "@tsed/core";

import {Consumes} from "./consumes.js";

/**
 * Set a mime list which are acceptable and checks if the specified content types are acceptable, based on the request’s Accept HTTP header field.
 *
 * ```typescript
 *  @Controller('/mypath')
 *  export class MyCtrl {
 *
 *    @Get('/')
 *    @AcceptMime('application/x-www-form-urlencoded')
 *    public getResource(){}
 *  }
 * ```
 *
 * @param mimes
 * @decorator
 * @operation
 * @response
 */
export function AcceptMime(...mimes: string[]): ClassDecorator & MethodDecorator {
  return useDecorators(Consumes(...mimes), StoreSet("acceptMimes", mimes));
}
