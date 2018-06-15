import {EndpointInfo, EndpointMetadata, IMiddleware, Middleware, Next, Req, Res, ServerSettingsService} from "@tsed/common";
import * as Express from "express";
import * as multer from "multer";

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
   * @param next
   * @returns {any}
   */
  use(
    @EndpointInfo() endpoint: EndpointMetadata,
    @Req() request: Express.Request,
    @Res() response: Express.Response,
    @Next() next: Express.NextFunction
  ) {
    const dest = this.serverSettingsService.uploadDir;
    const conf = endpoint.store.get(MultipartFileMiddleware);
    const options = Object.assign({dest}, this.serverSettingsService.get("multer") || {}, conf.options || {});

    if (!conf.any) {
      const fields = conf.fields.map(({name, maxCount}: any) => ({name, maxCount}));

      return this.multer(options).fields(fields)(request, response, next);
    }

    return this.multer(options).any()(request, response, next);
  }
}
