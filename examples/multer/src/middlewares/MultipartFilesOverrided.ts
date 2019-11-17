import {Configuration, EndpointInfo, EndpointMetadata, IMiddleware, OverrideProvider, Req, Res} from "@tsed/common";
import {MultipartFileMiddleware} from "@tsed/multipartfiles";
import * as Express from "express";
import * as multer from "multer";
import {BadRequest} from "ts-httpexceptions";
import {promisify} from "util";

@OverrideProvider(MultipartFileMiddleware)
export class MultipartFileMiddlewareOverrided implements IMiddleware {

  private multer: any = multer;

  constructor(@Configuration private configuration: Configuration) {
  }

  /**
   *
   * @param endpoint
   * @param request
   * @param response
   * @returns {any}
   */
  async use(@EndpointInfo() endpoint: EndpointMetadata, @Req() request: Express.Request, @Res() response: Express.Response) {

    if (1 === 1) {
      throw new BadRequest(`This should be thrown and seen on the test failure.`);
    }

    try {
      const endpointConfiguration = endpoint.store.get(MultipartFileMiddleware);

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
