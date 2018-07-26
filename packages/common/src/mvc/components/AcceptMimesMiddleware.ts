import {NotAcceptable} from "ts-httpexceptions";
import {EndpointInfo} from "../../filters/decorators/endpointInfo";
import {Request} from "../../filters/decorators/request";
import {EndpointMetadata} from "../class/EndpointMetadata";
import {Middleware} from "../decorators/class/middleware";
import {IMiddleware} from "../interfaces";

/**
 * @private
 * @middleware
 */
@Middleware()
export class AcceptMimesMiddleware implements IMiddleware {
  public use(@EndpointInfo() endpoint: EndpointMetadata, @Request() request: any): void {
    const mimes = endpoint.get(AcceptMimesMiddleware) || [];

    const find = mimes.find((mime: string) => request.accepts(mime));

    if (!find) {
      throw new NotAcceptable(mimes.join(", "));
    }
  }
}
