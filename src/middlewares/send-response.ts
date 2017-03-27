
import {IMiddleware} from "../interfaces";
import {Middleware} from "../decorators/class/middleware";
import {Response} from "../decorators/param/response";
import * as Express from "express";
import ConverterService from "../services/converter";
import {ResponseData} from "../decorators/param/response-data";

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