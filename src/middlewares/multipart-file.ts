
import {Middleware} from "../decorators/middleware";
import {IMiddleware} from "../interfaces/Middleware";
import {Request} from "../decorators/request";
import {Response} from "../decorators/response";
import {EndpointInfo} from "../decorators/endpoint-info";
import {Endpoint} from "../controllers/endpoint";
import {Next} from "../decorators/next";
import {ServerSettingsService} from "../services/server-settings";
import {$log} from "ts-log-debug";

@Middleware()
export default class MultipartFileMiddleware  implements IMiddleware  {

    private multer;

    constructor(private serverSettingsService: ServerSettingsService) {
        /* istanbul ignore else */
        if (require.resolve("multer")) {
            this.multer = require("multer");
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