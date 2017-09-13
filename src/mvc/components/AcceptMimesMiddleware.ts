/**
 * @module common/mvc
 */
/** */
import {NotAcceptable} from "ts-httpexceptions";
import {EndpointMetadata} from "../class/EndpointMetadata";
import {Middleware} from "../decorators/class/middleware";
import {EndpointInfo} from "../decorators/param/endpointInfo";
import {Request} from "../decorators/param/request";
import {IMiddleware} from "../interfaces";

/**
 * @private
 * @middleware
 */
@Middleware()
export class AcceptMimesMiddleware implements IMiddleware {

    public use(@EndpointInfo() endpoint: EndpointMetadata,
               @Request() request: any): void {

        const mimes = endpoint.get(AcceptMimesMiddleware) || [];

        mimes.forEach((mime: string) => {
            if (!request.accepts(mime)) {
                throw new NotAcceptable(mime);
            }
        });

    }
}