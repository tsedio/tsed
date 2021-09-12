import {useDecorators} from "@tsed/core";
import {Produces} from "@tsed/schema";
import {EndpointFn} from "./endpointFn";

/**
 * Set a mime list which are acceptable and checks if the specified content types are acceptable, based on the request’s Accept HTTP header field.
 *
 * ```typescript
 *  @Controller('/mypath')
 *  export class MyCtrl {
 *
 *    @Get('/')
 *    @AcceptMime('application/json')
 *    public getResource(){}
 *  }
 * ```
 *
 * @param mimes
 * @decorator
 * @operation
 * @response
 */
export function AcceptMime(...mimes: string[]): Function {
  return useDecorators(
    Produces(...mimes),
    EndpointFn((endpoint) => {
      endpoint.acceptMimes = mimes;
    })
  );
}
