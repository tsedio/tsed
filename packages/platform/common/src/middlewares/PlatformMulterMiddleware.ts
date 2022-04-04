import type {MulterError} from "multer";
import {Constant, Inject, Value} from "@tsed/di";
import {BadRequest} from "@tsed/exceptions";
import {Middleware, MiddlewareMethods} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";
import {PlatformMulterField, PlatformMulterSettings} from "../config/interfaces/PlatformMulterSettings";
import {PlatformApplication} from "../services/PlatformApplication";
import {PlatformConfiguration} from "../config/services/PlatformConfiguration";

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
@Middleware()
export class PlatformMulterMiddleware implements MiddlewareMethods {
  @Value("multer", {}) // NOTE: don't use constant to getting multer configuration. See issue #1840
  protected settings: PlatformMulterSettings;

  @Inject()
  protected app: PlatformApplication;

  async use(@Context() ctx: Context) {
    try {
      const {fields, options = {}} = ctx.endpoint.get(PlatformMulterMiddleware);
      const settings: PlatformMulterSettings = {
        ...this.settings,
        ...options
      };

      /* istanbul ignore next */
      if (settings.storage) {
        delete settings.dest;
      }

      const middleware: any = this.app.multer(settings).fields(this.getFields({fields}));

      return await middleware(ctx.getRequest(), ctx.getResponse());
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
