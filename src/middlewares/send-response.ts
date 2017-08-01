import * as Express from "express";
import {Middleware} from "../decorators/middleware";
import {Response} from "../decorators/response";
import {ResponseData} from "../decorators/response-data";
import {IMiddleware} from "../interfaces/Middleware";
import ConverterService from "../services/converter";

@Middleware()
export default class SendResponseMiddleware implements IMiddleware {

    constructor(private converterService: ConverterService) {

    }

    public use(@ResponseData() data: any, @Response() response: Express.Response) {

        if (data !== undefined) {
            const type = typeof data;
            if (data === null || ["number", "boolean", "string"].indexOf(type) > -1) {
                response.send(String(data));
            } else {
                response.setHeader("Content-Type", "text/json");
                response.json(this.converterService.serialize(data));
            }
        }
    }
}