import {EndpointInfo, EndpointMetadata, IMiddleware, Middleware, Req, Res, ServerSettingsService} from "@tsed/common";
import * as Express from "express";
import * as multer from "multer";
import {BadRequest} from "ts-httpexceptions";

/**
 * @private
 * @middleware
 */
@Middleware()
export class MultipartFileMiddleware implements IMiddleware {
  private multer: any = multer;

  constructor(private serverSettingsService: ServerSettingsService) {}

  /**
   *
   * @param endpoint
   * @param request
   * @param response
   * @returns {any}
   */
  use(@EndpointInfo() endpoint: EndpointMetadata, @Req() request: Express.Request, @Res() response: Express.Response) {
    const dest = this.serverSettingsService.uploadDir;
    const conf = endpoint.store.get(MultipartFileMiddleware);
    const options = Object.assign({dest}, this.serverSettingsService.get("multer") || {}, conf.options || {});

    return new Promise((resolve, reject) => {
      const onResponse = (err: any) => (err ? reject(err) : resolve());

      if (!conf.any) {
        const fields = conf.fields.map(({name, maxCount}: any) => ({name, maxCount}));

        return this.multer(options).fields(fields)(request, response, onResponse);
      }

      return this.multer(options).any()(request, response, onResponse);
    }).catch(er => {
      throw er.code ? new BadRequest(`${er.message} ${er.field || ""}`.trim()) : er;
    });
  }
}
