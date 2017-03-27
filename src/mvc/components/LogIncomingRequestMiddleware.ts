/**
 * @module mvc
 */
/** */
import {$log} from "ts-log-debug";
import {Middleware} from "../decorators/class/middleware";
import {IMiddleware} from "../interfaces";
import {Req} from "../decorators/param/request";
/**
 * @private
 */
@Middleware()
export class LogIncomingRequestMiddleware implements IMiddleware {

    private AUTO_INCREMENT_ID = 1;

    public use(@Req() request: any): void {
        request.id = request.id ? request.id : this.AUTO_INCREMENT_ID++;
        request.tagId = `[#${(request as any).id}]`;
        request.tsExpressHandleStart = new Date();

        $log.debug(request.tagId, "-- Incoming request --------------------------------------------------------");
        $log.debug(request.tagId, "Route =>", request.method, request.originalUrl || request.url);
        $log.debug(request.tagId, "Request.id =>", request.id);
        $log.debug(request.tagId, "Headers =>", JSON.stringify(request.headers).trim());
        $log.debug(request.tagId, "----------------------------------------------------------------------------");
    }
}