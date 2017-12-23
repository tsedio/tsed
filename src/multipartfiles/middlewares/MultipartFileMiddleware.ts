/**
 * @module multiparfiles
 */
/** */
import {$log} from "ts-log-debug";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {EndpointInfo} from "../../filters/decorators/endpointInfo";
import {Next} from "../../filters/decorators/next";
import {Req} from "../../filters/decorators/request";
import {Res} from "../../filters/decorators/response";
import {EndpointMetadata} from "../../mvc/class/EndpointMetadata";
import {Middleware} from "../../mvc/decorators";
import {IMiddleware} from "../../mvc/interfaces";

/**
 * @private
 * @middleware
 */
@Middleware()
export class MultipartFileMiddleware implements IMiddleware {

    private multer: any;

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
        @Req() request: Express.Request,
        @Res() response: Express.Response,
        @Next() next: Express.NextFunction) {

        if (this.multer) {
            const dest = this.serverSettingsService.uploadDir;

            const options = Object.assign(
                {dest},
                this.serverSettingsService.get("multer") || {},
                endpoint.store.get(MultipartFileMiddleware) || {}
            );

            const middleware = this.multer(options);

            return middleware.any()(request, response, next);
        } else {
            $log.warn("Multer isn't installed ! Run npm install --save multer before using Multipart decorators.");
        }

    }
}