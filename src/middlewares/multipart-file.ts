
import {Middleware} from "../decorators/middleware";
import {IMiddleware} from "../interfaces/Middleware";
import {Request} from "../decorators/request";
import {ServerLoader} from "../server/server-loader";
import {Response} from "../decorators/response";
import {EndpointInfo} from "../decorators/endpoint-info";
import {Endpoint} from "../controllers/endpoint";
import {Next} from "../decorators/next";
import {ServerSettingsService} from "../services/server-setting";

@Middleware()
export default class MultipartFileMiddleware  implements IMiddleware  {

    constructor(private serverSettingsService: ServerSettingsService) {

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
        @Response() response: Express.Request,
        @Next() next: Express.NextFunction
    ) {

        const middleware = require("multer")(Object.assign({
            dest: this.serverSettingsService.uploadDir,
        }, endpoint.getMetadata(MultipartFileMiddleware) || {}));


        return middleware.any()(request, response, next);
    }
}