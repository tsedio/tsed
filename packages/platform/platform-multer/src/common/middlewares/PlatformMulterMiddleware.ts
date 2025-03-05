import {constant, DIContext, inject, injectable, ProviderType} from "@tsed/di";
import {MiddlewareMethods} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";
import {JsonMethodStore} from "@tsed/schema";
import type {Field, Options} from "multer";

import {MULTER_MODULE, PLATFORM_MULTER_OPTIONS} from "../constants/constants.js";
import {MulterException} from "../errors/MulterException.js";

/**
 * @middleware
 */
export class PlatformMulterMiddleware implements MiddlewareMethods {
  async use(@Context() ctx: DIContext & {endpoint: JsonMethodStore}) {
    try {
      const {fields, options = {}} = ctx.endpoint.get<{
        fields: Field[];
        options: Options;
      }>(PLATFORM_MULTER_OPTIONS);

      const settings: Options = {
        ...constant<Options>("multer", {}),
        ...options
      };

      /* istanbul ignore next */
      if (settings.storage) {
        delete settings.dest;
      }

      const {get} = await inject<Promise<MULTER_MODULE>>(MULTER_MODULE);

      const middleware: any = get(settings).fields(fields);

      return await middleware(ctx.getRequest(), ctx.getResponse());
    } catch (er) {
      if (er.code) {
        throw new MulterException(er);
      }

      throw er;
    }
  }
}

injectable(PlatformMulterMiddleware).type(ProviderType.MIDDLEWARE).priority(-10);
