import {isBoolean, isNumber, isObject, isStream, isString} from "@tsed/core";
import {Inject} from "@tsed/di";
import {Middleware} from "../../mvc/decorators/class/middleware";
import {TemplateRenderingError} from "../../mvc/errors/TemplateRenderingError";
import {IMiddleware} from "../../mvc/interfaces/IMiddleware";
import {ConverterService} from "../../mvc/services/ConverterService";
import {ABORT} from "../constants/abort";

import {Context} from "../decorators/context";

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

  public async use(@Context() ctx: Context) {
    const {response, endpoint} = ctx;
    let {data} = ctx;

    if (endpoint.view) {
      data = await this.render(ctx);
    } else if (this.shouldSerialize(data)) {
      data = this.mapper.serialize(data, {type: endpoint.type});
    }

    this.setContentType(data, ctx);
    response.body(data);

    return ABORT;
  }

  protected setContentType(data: any, ctx: Context) {
    const {endpoint, response} = ctx;
    const {operation} = endpoint;

    const contentType = operation.getContentTypeOf(response.statusCode) || "";

    if (contentType && contentType !== "*/*") {
      if (contentType === "application/json") {
        if (isObject(data)) {
          response.contentType(contentType);
        }
      } else {
        response.contentType(contentType);
      }
    }
  }

  protected async render(@Context() ctx: Context) {
    const {response, endpoint} = ctx;
    try {
      const {data} = ctx;
      const {path, options} = endpoint.view;

      return await response.render(path, {...options, ...data});
    } catch (err) {
      throw new TemplateRenderingError(endpoint.targetName, endpoint.propertyKey, err);
    }
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
