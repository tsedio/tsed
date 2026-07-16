import {DIContext, ProviderType, constant, inject, injectable} from "@tsed/di";
import type {Field, Options} from "multer";
import {MULTER_MODULE, PLATFORM_MULTER_OPTIONS} from "../constants/constants.js";
import {Context} from "@tsed/platform-params";
import {JsonMethodStore} from "@tsed/schema";
import {MiddlewareMethods} from "@tsed/platform-middlewares";
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
        settings.dest = undefined;
      }

      const {get} = await inject<Promise<MULTER_MODULE>>(MULTER_MODULE);

      const middleware: any = get(settings).fields(fields);

      return await middleware(ctx.getRequest(), ctx.getResponse());
    } catch (er) {
      const error = er as {code?: string};

      if (error.code) {
        throw new MulterException(error as any);
      }

      throw error;
    }
  }
}

injectable(PlatformMulterMiddleware).type(ProviderType.MIDDLEWARE).priority(-10);
