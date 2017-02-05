
import {IMiddleware} from "../interfaces/Middleware";
import {Middleware} from "../decorators/middleware";
import {ResponseData} from "../decorators/response-data";
import {Response} from "../decorators/response";
import * as Express from "express";
import ConverterService from "../services/converter";

@Middleware()
export default class SendResponseMiddleware implements IMiddleware {

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