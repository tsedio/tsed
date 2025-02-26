import {constant, inject, injectable, ProviderType} from "@tsed/di";
import {BadRequest} from "@tsed/exceptions";
import {MiddlewareMethods} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";
import type {MulterError} from "multer";

import {PlatformMulterField, PlatformMulterSettings} from "../config/interfaces/PlatformMulterSettings.js";
import {PlatformContext} from "../domain/PlatformContext.js";
import {PlatformAdapter} from "../services/PlatformAdapter.js";
import {PlatformApplication} from "../services/PlatformApplication.js";

export interface MulterInputOptions {
  fields: PlatformMulterField[];
}

export class MulterException extends BadRequest {
  constructor(er: MulterError) {
    super(er.message);
    this.origin = er;
    this.name = er.code;
  }
}

/**
 * @middleware
 */
export class PlatformMulterMiddleware implements MiddlewareMethods {
  async use(@Context() ctx: PlatformContext) {
    try {
      const {fields, options = {}} = ctx.endpoint.get(PlatformMulterMiddleware);
      const settings: PlatformMulterSettings = {
        ...constant("multer", {}),
        ...options
      };

      /* istanbul ignore next */
      if (settings.storage) {
        delete settings.dest;
      }

      const multer = inject(PlatformAdapter).multipart(settings);

      if (multer) {
        const middleware: any = multer.fields(this.getFields({fields}));

        return await middleware(ctx.getRequest(), ctx.getResponse());
      }
    } catch (er) {
      if (er.code) {
        throw new MulterException(er);
      }

      throw er;
    }
  }

  protected getFields(conf: MulterInputOptions) {
    return conf.fields.map(({name, maxCount}) => ({name, maxCount}));
  }
}

injectable(PlatformMulterMiddleware).type(ProviderType.MIDDLEWARE).priority(-10);
