import {isBoolean, isNumber, isStream, isString} from "@tsed/core";
import {Inject} from "@tsed/di";
import {ConverterService} from "../../converters/services/ConverterService";
import {Middleware} from "../../mvc/decorators/class/middleware";
import {IMiddleware} from "../../mvc/interfaces/IMiddleware";
import {ABORT} from "../constants/abort";
import {Context} from "../decorators/context";
import {ResponseViewMiddleware} from "./ResponseViewMiddleware";

/**
 * Transform data to a response
 *
 * @platform
 * @middleware
 */
@Middleware()
export class PlatformResponseMiddleware implements IMiddleware {
  @Inject()
  mapper: ConverterService;

  @Inject()
  renderMiddleware: ResponseViewMiddleware;

  public async use(@Context() ctx: Context) {
    const {response, endpoint} = ctx;
    let {data} = ctx;

    if (endpoint.view) {
      // TODO change this in V6.
      data = await this.renderMiddleware.use(data, endpoint, response.raw);
    } else if (this.shouldSerialize(data)) {
      data = this.mapper.serialize(data, {type: endpoint.response.type, withIgnoredProps: false});
    }

    response.body(data);

    return ABORT;
  }

  protected shouldSerialize(data: any) {
    return !(this.shouldBeStreamed(data) || this.shouldBeSent(data) || data === undefined);
  }

  protected shouldBeSent(data: any) {
    return Buffer.isBuffer(data) || isBoolean(data) || isNumber(data) || isString(data) || data === null;
  }

  protected shouldBeStreamed(data: any) {
    return isStream(data);
  }
}
