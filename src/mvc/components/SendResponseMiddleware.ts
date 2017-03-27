/**
 * @module mvc
 */
/** */
import * as Express from "express";

import {Middleware} from "../decorators/class/middleware";
import {IMiddleware} from "../interfaces/index";
import {ConverterService} from "../../converters/services/ConverterService";
import {ResponseData} from "../decorators/param/responseData";
import {Response} from "../decorators/param/response";
/**
 * @private
 */
@Middleware()
export class SendResponseMiddleware implements IMiddleware {

    constructor(private converterService: ConverterService) {

    }

    public use(@ResponseData() data: any, @Response() response: Express.Response) {

        if (response.headersSent) {
            return;
        }

        const type = typeof data;

        if (data === undefined) {
            response.send("");
        } else if (data === null || ["number", "boolean", "string"].indexOf(type) > -1) {
            response.send(data);
        } else {

            response.setHeader("Content-Type", "text/json");
            response.json(this.converterService.serialize(data));

        }

    }
}