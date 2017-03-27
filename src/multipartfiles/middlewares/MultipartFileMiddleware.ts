/**
 * @module multiparfiles
 */
/** */
import {$log} from "ts-log-debug";
import {Middleware} from "../../mvc/decorators/class/middleware";
import {ServerSettingsService} from "../../server/services/ServerSettings";
import {IMiddleware} from "../../mvc/interfaces/index";
import {EndpointInfo, Next, Request, Response} from "../../mvc";
import {EndpointMetadata} from "../../mvc/class/EndpointMetadata";
/**
 * @private
 */
@Middleware()
export class MultipartFileMiddleware implements IMiddleware {

    private multer;

    constructor(private serverSettingsService: ServerSettingsService) {

        try {
            /* istanbul ignore else */
            if (require.resolve("multer")) {
                this.multer = require("multer");
            }
        } catch (er) {

        }
    }

    /**
     *
     * @param endpoint
     * @param request
     * @param response
     * @param next
     * @returns {any}
     */
    use(@EndpointInfo() endpoint: EndpointMetadata,
        @Request() request: Express.Request,
        @Response() response: Express.Response,
        @Next() next
    ) {

        if (this.multer) {
            const options = Object.assign({
                dest: this.serverSettingsService.uploadDir,
            }, endpoint.getMetadata(MultipartFileMiddleware) || {});

            const middleware = this.multer(options);

            return middleware.any()(request, response, next);
        } else {
            $log.warn("Multer isn't installed ! Run npm install --save multer before using Multipart decorators.");
        }

    }
}