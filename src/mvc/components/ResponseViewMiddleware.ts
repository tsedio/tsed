/**
 * @module common/mvc
 */ /** */

import * as Express from "express";
import {EndpointMetadata} from "../class/EndpointMetadata";
import {Middleware} from "../decorators/class/middleware";
import {EndpointInfo} from "../decorators/param/endpointInfo";
import {Response} from "../decorators/param/response";
import {ResponseData} from "../decorators/param/responseData";
import {TemplateRenderingError} from "../errors/TemplateRenderingError";
import {IMiddleware} from "../interfaces";
/**
 * @private
 * @middleware
 */
@Middleware()
export class ResponseViewMiddleware implements IMiddleware {

    public use(
        @ResponseData() data: any,
        @EndpointInfo() endpoint: EndpointMetadata,
        @Response() response: Express.Response
    ) {

        if (response.headersSent) {
           return;
        }

        return new Promise((resolve, reject) => {

            const {viewPath, viewOptions} = endpoint.store.get(ResponseViewMiddleware);

            if (viewPath !== undefined) {

                if (viewOptions !== undefined ) {
                    data = Object.assign({}, data, viewOptions);
                }

                response.render(viewPath, data, (err, html) => {

                    /* istanbul ignore next */
                    if (err) {

                        reject(new TemplateRenderingError(
                            endpoint.target,
                            endpoint.methodClassName,
                            err
                        ));

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