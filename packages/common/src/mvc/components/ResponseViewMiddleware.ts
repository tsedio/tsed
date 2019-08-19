import {Middleware} from "../decorators/class/middleware";
import {EndpointInfo} from "../decorators/params/endpointInfo";
import {Res} from "../decorators/params/response";
import {ResponseData} from "../decorators/params/responseData";
import {TemplateRenderingError} from "../errors/TemplateRenderingError";
import {IMiddleware} from "../interfaces";

/**
 * See example to override ResponseViewMiddleware [here](/docs/middlewares/override/response-view.md).
 * @middleware
 */
@Middleware()
export class ResponseViewMiddleware implements IMiddleware {
  public use(@ResponseData() data: any, @EndpointInfo() endpoint: EndpointInfo, @Res() response: Res) {
    return new Promise((resolve, reject) => {
      const {viewPath, viewOptions} = endpoint.store.get(ResponseViewMiddleware);

      if (viewPath !== undefined) {
        if (viewOptions !== undefined) {
          data = Object.assign({}, data, viewOptions);
        }

        response.render(viewPath, data, (err: any, html) => {
          /* istanbul ignore next */
          if (err) {
            reject(new TemplateRenderingError(endpoint.target, endpoint.propertyKey, err));
          } else {
            resolve(html);
          }
        });
      } else {
        resolve();
      }
    });
  }
}
