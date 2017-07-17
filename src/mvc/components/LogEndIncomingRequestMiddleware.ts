/**
 * @module common/mvc
 */
/** */
import {$log} from "ts-log-debug";
import {Middleware} from "../decorators/class/middleware";
import {Req} from "../decorators/param/request";
import {Res} from "../decorators/param/response";
import {IMiddleware} from "../interfaces";
/**
 * @private
 * @middleware
 */
@Middleware()
export class LogEndIncomingRequestMiddleware implements IMiddleware {

    public use(@Req() request: any, @Res() response): void {
        /* istanbul ignore else */
        if (request.id) {
            const status = response._header
                ? response.statusCode
                : undefined;
            $log.debug(request.tagId, request.method, request.originalUrl || request.url, status, new Date().getTime() - request.tsExpressHandleStart.getTime(), "ms");
            $log.debug(request.tagId, "-- End Incoming request -----------------------------------------------------");
            delete request.id;
        }
    }
}