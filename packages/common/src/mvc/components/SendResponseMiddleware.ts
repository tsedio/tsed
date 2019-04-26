import {ConverterService} from "@tsed/converters";
import {isBoolean, isNumber, isString} from "@tsed/core";
import * as Express from "express";
import {EndpointInfo} from "../../filters";
import {Response} from "../../filters/decorators/response";
import {ResponseData} from "../../filters/decorators/responseData";
import {Middleware} from "../decorators/class/middleware";
import {IMiddleware} from "../interfaces/index";

@Middleware()
export class SendResponseMiddleware implements IMiddleware {
  constructor(protected converterService: ConverterService) {}

  /**
   * Send response
   * @param data
   * @param response
   * @param endpoint Do not remove endpoint parameters. It tell HandlerBuilder to run this middleware only when the previous called middlewares are an endpoint.
   */
  public use(@ResponseData() data: any, @Response() response: Express.Response, @EndpointInfo() endpoint: EndpointInfo) {
    if (data === undefined) {
      return response.send();
    }

    if (isBoolean(data) || isNumber(data) || isString(data) || data === null) {
      return response.send(data);
    }

    return response.json(this.converterService.serialize(data));
  }
}
