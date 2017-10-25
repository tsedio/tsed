/**
 * @module common/mvc
 */
/** */
import * as Express from "express";
import {ConverterService} from "../../converters/services/ConverterService";

import {Middleware} from "../decorators/class/middleware";
import {Response} from "../../filters/decorators/response";
import {ResponseData} from "../../filters/decorators/responseData";
import {IMiddleware} from "../interfaces/index";

/**
 * @private
 * @middleware
 */
@Middleware()
export class SendResponseMiddleware implements IMiddleware {

    constructor(private converterService: ConverterService) {

    }

    public use(@ResponseData() data: any, @Response() response: Express.Response) {
        const type = typeof data;

        if (data !== undefined) {
            if (data === null || ["number", "boolean", "string"].indexOf(type) > -1) {
                response.send(String(data));
            } else {
                response.json(this.converterService.serialize(data));
            }
        }
    }
}