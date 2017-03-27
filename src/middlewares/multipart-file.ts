
import {Middleware} from "../decorators/class/middleware";
import {IMiddleware} from "../interfaces";
import {Request} from "../decorators/param/request";
import {Response} from "../decorators/param/response";
import {EndpointInfo} from "../decorators/param/endpoint-info";
import {Endpoint} from "../controllers/endpoint";
import {Next} from "../decorators/param/next";
import {ServerSettingsService} from "../services/server-settings";
import {$log} from "ts-log-debug";

@Middleware()
export default class MultipartFileMiddleware  implements IMiddleware  {

    private multer;

    constructor(private serverSettingsService: ServerSettingsService) {
        /* istanbul ignore else */

        try {
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
    use(
        @EndpointInfo() endpoint: Endpoint,
        @Request() request: Express.Request,
        @Response() response: Express.Response,
        @Next() next
    ) {

        if (this.multer) {
            const middleware = this.multer(Object.assign({
                dest: this.serverSettingsService.uploadDir,
            }, endpoint.getMetadata(MultipartFileMiddleware) || {}));

            return middleware.any()(request, response, next);
        } else {
            $log.warn("Multer isn't installed ! Run npm install --save multer before using Multipart decorator.");
        }

    }
}