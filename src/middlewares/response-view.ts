
import {IMiddleware} from "../interfaces";
import {Middleware} from "../decorators/class/middleware";
import {ResponseData} from "../decorators/param/response-data";
import {Response} from "../decorators/param/response";
import * as Express from "express";
import {EndpointInfo} from "../decorators/param/endpoint-info";
import {Endpoint} from "../controllers/endpoint";
import {InternalServerError} from "ts-httpexceptions";
import {getClassName} from "../utils";
import {TEMPLATE_RENDERING_ERROR} from "../constants/errors-msgs";


@Middleware()
export default class ResponseViewMiddleware implements IMiddleware {

    public use(
        @ResponseData() data: any,
        @EndpointInfo() endpoint: Endpoint,
        @Response() response: Express.Response
    ) {

        if (response.headersSent) {
           return;
        }

        return new Promise((resolve, reject) => {

            const {viewPath, viewOptions} = endpoint.getMetadata(ResponseViewMiddleware);

            if (viewPath !== undefined) {

                if (viewOptions !== undefined ) {
                    data = Object.assign({}, data, viewOptions);
                }

                response.render(viewPath, data, (err, html) => {

                    /* istanbul ignore next */
                    if (err) {

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