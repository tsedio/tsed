import {Middleware} from "../../mvc/decorators/class/middleware";
import {EndpointInfo} from "../../mvc/decorators/params/endpointInfo";
import {Res} from "../../mvc/decorators/params/response";
import {ResponseData} from "../../mvc/decorators/params/responseData";
import {TemplateRenderingError} from "../../mvc/errors/TemplateRenderingError";
import {IMiddleware} from "../../mvc/interfaces/IMiddleware";

/**
 * Render a view.
 *
 * @middleware
 * @deprecated Will be removed in favor of PlatformResponseMiddleware in v6.
 */
@Middleware()
export class ResponseViewMiddleware implements IMiddleware {
  async use(@ResponseData() data: any, @EndpointInfo() endpoint: EndpointInfo, @Res() response: Res) {
    // TODO Move this code inside PlatformResponse
    try {
      const {path, options} = endpoint.view;

      return await new Promise((resolve, reject) =>
        response.render(path, {...options, ...data}, (err, content) => {
          err ? reject(err) : resolve(content);
        })
      );
    } catch (err) {
      throw new TemplateRenderingError(endpoint.target, endpoint.propertyKey, err);
    }
  }
}
