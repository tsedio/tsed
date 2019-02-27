import {
  EndpointInfo,
  EndpointMetadata,
  IMiddleware,
  OverrideMiddleware,
  Req,
  Res,
  ServerSettingsService
} from "@tsed/common";
import {promisify} from "@tsed/core";
import {MultipartFileMiddleware} from "@tsed/multipartfiles";
import * as Express from "express";
import * as multer from "multer";
import {BadRequest} from "ts-httpexceptions";

@OverrideMiddleware(MultipartFileMiddleware)
export class MultipartFileMiddlewareOverrided implements IMiddleware {

  private multer: any = multer;

  constructor(private serverSettingsService: ServerSettingsService) {
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

      return await promisify(this.invoke(endpointConfiguration), request, response);
    } catch (er) {
      throw er.code ? new BadRequest(`${er.message} ${er.field || ""}`.trim()) : er;
    }
  }

  invoke(conf: any) {
    const dest = this.serverSettingsService.uploadDir;
    const options = Object.assign({dest}, this.serverSettingsService.get("multer") || {}, conf.options || {});

    if (!conf.any) {
      const fields = conf.fields.map(({name, maxCount}: any) => ({name, maxCount}));

      return this.multer(options).fields(fields);
    }

    return this.multer(options).any();
  }
}
