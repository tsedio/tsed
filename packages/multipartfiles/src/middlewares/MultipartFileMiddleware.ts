import {Configuration, EndpointInfo, IMiddleware, Middleware, Req, Res} from "@tsed/common";
import * as multer from "multer";
import {BadRequest} from "ts-httpexceptions";
import {promisify} from "util";

/**
 * @middleware
 */
@Middleware()
export class MultipartFileMiddleware implements IMiddleware {
  private multer: any = multer;

  constructor(@Configuration() private configuration: Configuration) {}

  async use(@EndpointInfo() endpoint: EndpointInfo, @Req() request: Req, @Res() response: Res) {
    try {
      const endpointConfiguration = endpoint.get(MultipartFileMiddleware);

      return await promisify(this.invoke(endpointConfiguration))(request, response);
    } catch (er) {
      throw er.code ? new BadRequest(`${er.message} ${er.field || ""}`.trim()) : er;
    }
  }

  invoke(conf: any) {
    const dest = this.configuration.uploadDir;
    const options = Object.assign({dest}, this.configuration.get("multer") || {}, conf.options || {});

    if (!conf.any) {
      const fields = conf.fields.map(({name, maxCount}: any) => ({name, maxCount}));

      return this.multer(options).fields(fields);
    }

    return this.multer(options).any();
  }
}
