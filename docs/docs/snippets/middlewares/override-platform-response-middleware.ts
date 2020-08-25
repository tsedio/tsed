import {PlatformResponseMiddleware, TemplateRenderingError} from "@tsed/common";
import {isBoolean, isNumber, isStream, isString} from "@tsed/core";
import {Inject, OverrideProvider} from "@tsed/di";
import {ConverterService} from "../../converters/services/ConverterService";
import {Context} from "../decorators/context";

@OverrideProvider(PlatformResponseMiddleware)
export class CustomPlatformResponseMiddleware {
  @Inject()
  mapper: ConverterService;

  public async use(@Context() ctx: Context) {
    // Context contain endpoint information, a request and response abstraction and the current data.
    const {response, endpoint} = ctx;
    let {data} = ctx;

    if (endpoint.view) {
      // Render the view if @@View@@ decorator is used
      data = await this.render(data, endpoint);
    } else if (this.shouldSerialize(data)) {
      // Serialize the object
      data = this.mapper.serialize(data, {type: endpoint.response.type, withIgnoredProps: false});
    }

    // The response is an instance of PlatformResponse which expose a body method to send response.
    // If you want the original response from Express use response.raw => Express.Response
    response.body(data);

    return response; // return response is required to stop the next handlers
  }

  async render(data: any, ctx: Context) {
    const {response, endpoint} = ctx;

    try {
      const {path, options} = endpoint.view;

      // NOTE: response is an instance of PlatformResponse class.
      // If you want the original response from Express use response.raw => Express.Response

      return response.render(path, {...options, ...data});
    } catch (err) {
      throw new TemplateRenderingError(endpoint.target, endpoint.propertyKey, err);
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
