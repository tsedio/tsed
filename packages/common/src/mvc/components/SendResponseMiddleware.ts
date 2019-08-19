import {isBoolean, isNumber, isStream, isString} from "@tsed/core";
import {ConverterService} from "../../converters";
import {Middleware, Res, ResponseData} from "../decorators";
import {IMiddleware} from "../interfaces/index";

/**
 * See example to override SendResponseMiddleware [here](/docs/middlewares/override/send-response.md).
 * @middleware
 */
@Middleware()
export class SendResponseMiddleware implements IMiddleware {
  constructor(protected converterService: ConverterService) {}

  public use(@ResponseData() data: any, @Res() response: Res) {
    if (data === undefined) {
      return response.send();
    }

    if (isStream(data)) {
      data.pipe(response);

      return response;
    }

    if (isBoolean(data) || isNumber(data) || isString(data) || data === null) {
      return response.send(data);
    }

    return response.json(this.converterService.serialize(data));
  }
}
