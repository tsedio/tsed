/**
 * @module mvc
 */
/** */
import {NotAcceptable} from "ts-httpexceptions";
import {Middleware} from "../decorators/class/middleware";
import {IMiddleware} from "../interfaces";
import {EndpointInfo} from "../decorators/param/endpointInfo";
import {Request} from "../decorators/param/request";
import {EndpointMetadata} from "../class/EndpointMetadata";
/**
 * @private
 */
@Middleware()
export class AcceptMimesMiddleware implements IMiddleware {

    public use(@EndpointInfo() endpoint: EndpointMetadata,
               @Request() request: any): void {

        const mimes = endpoint.getMetadata(AcceptMimesMiddleware) || [];

        mimes.forEach((mime) => {
            if (!request.accepts(mime)) {
                throw new NotAcceptable(mime);
            }
        });

    }
}