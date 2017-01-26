
import {IMiddleware} from "../interfaces/Middleware";
import {Middleware} from "../decorators/middleware";
import {ResponseData} from "../decorators/response-data";
import {Response} from "../decorators/response";
import * as Express from "express";
import {RESPONSE_VIEW, RESPONSE_VIEW_OPTIONS} from "../constants/metadata-keys";
import {EndpointInfo} from "../decorators/endpoint-info";
import {Endpoint} from "../controllers/endpoint";

@Middleware()
export default class ResponseViewMiddleware implements IMiddleware {

    public use(@ResponseData() data: any, @EndpointInfo() endpoint: Endpoint, @Response() response: Express.Response) {

        if (!response.headersSent) {
           return;
        }

        const viewPath = endpoint.getMetadata(RESPONSE_VIEW);
        const viewOptions = endpoint.getMetadata(RESPONSE_VIEW_OPTIONS);

        if (viewPath !== undefined) {

            if (viewOptions !== undefined ) {
                data = Object.assign({}, data, viewOptions);
            }

            response.render(viewPath, data);
        }

    }
}