import * as Express from "express";
import {ConverterService} from "../../converters/services/ConverterService";
import {EndpointInfo} from "../../filters";
import {Response} from "../../filters/decorators/response";
import {ResponseData} from "../../filters/decorators/responseData";
import {EndpointMetadata} from "../class/EndpointMetadata";
import {Middleware} from "../decorators/class/middleware";
import {IMiddleware} from "../interfaces/index";

@Middleware()
export class SendResponseMiddleware implements IMiddleware {
  constructor(protected converterService: ConverterService) {}

  public use(@ResponseData() data: any, @Response() response: Express.Response, @EndpointInfo() endpoint: EndpointMetadata) {
    const type = typeof data;

    if (endpoint.statusCode === 204) {
      response.send();

      return;
    }

    if (data === undefined) {
      return;
    }

    if (data === null || ["number", "boolean", "string"].indexOf(type) > -1) {
      response.send(data && String(data));

      return;
    }

    response.json(this.converterService.serialize(data));
  }
}
