import {NotAcceptable} from "ts-httpexceptions";
import {EndpointInfo, Middleware, Req} from "../decorators";
import {IMiddleware} from "../interfaces";

/**
 * @middleware
 */
@Middleware()
export class AcceptMimesMiddleware implements IMiddleware {
  public use(@EndpointInfo() endpoint: EndpointInfo, @Req() request: Req): void {
    const mimes = endpoint.get(AcceptMimesMiddleware) || [];

    const find = mimes.find((mime: string) => request.accepts(mime));

    if (!find) {
      throw new NotAcceptable(mimes.join(", "));
    }
  }
}
