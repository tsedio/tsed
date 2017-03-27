/**
 * @module mvc
 */ /** */

import * as Express from "express";
import {Middleware} from "../decorators/class/middleware";
import {IMiddleware} from "../interfaces/index";
import {ResponseData} from "../decorators/param/responseData";
import {EndpointInfo} from "../decorators/param/endpointInfo";
import {Response} from "../decorators/param/response";
import {TemplateRenderingError} from "../errors/TemplateRenderingError";
import {EndpointMetadata} from "../class/EndpointMetadata";
/**
 * @private
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

            const {viewPath, viewOptions} = endpoint.getMetadata(ResponseViewMiddleware);

            if (viewPath !== undefined) {

                if (viewOptions !== undefined ) {
                    data = Object.assign({}, data, viewOptions);
                }

                response.render(viewPath, data, (err, html) => {

                    /* istanbul ignore next */
                    if (err) {

                        reject(new TemplateRenderingError(
                            endpoint.targetClass,
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