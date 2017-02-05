
import {IMiddleware} from "../interfaces/Middleware";
import {Middleware} from "../decorators/middleware";
import {ResponseData} from "../decorators/response-data";
import {Response} from "../decorators/response";
import * as Express from "express";
import {RESPONSE_VIEW, RESPONSE_VIEW_OPTIONS} from "../constants/metadata-keys";
import {EndpointInfo} from "../decorators/endpoint-info";
import {Endpoint} from "../controllers/endpoint";
import {Request} from "../decorators/request";
import {InternalServerError} from "ts-httpexceptions";
import {getClass} from "../utils/utils";
import {getClassName} from "../utils/class";
import {TEMPLATE_RENDERING_ERROR} from "../constants/errors-msgs";


@Middleware()
export default class ResponseViewMiddleware implements IMiddleware {

    public use(
        @ResponseData() data: any,
        @EndpointInfo() endpoint: Endpoint,
        @Response() response: Express.Response,
        @Request() request: Express.Request
    ) {

        if (response.headersSent) {
           return;
        }

        return new Promise((resolve, reject) => {

            const viewPath = endpoint.getMetadata(RESPONSE_VIEW);
            const viewOptions = endpoint.getMetadata(RESPONSE_VIEW_OPTIONS);

            if (viewPath !== undefined) {

                if (viewOptions !== undefined ) {
                    data = Object.assign({}, data, viewOptions);
                }

                response.render(viewPath, data, (err, html) => {

                    if (err) {
                        // $log.error(err);
                        // response.status(500).send("" + err);


                        reject(new InternalServerError(TEMPLATE_RENDERING_ERROR(
                            getClassName(endpoint.targetClass),
                            endpoint.methodClassName,
                            err
                        )));

                    } else {
                        // request.storeData(html);
                        resolve(html);
                    }

                });
            } else {
                resolve();
            }
        });

    }
}