import {Constant, Inject} from "@tsed/di";
import {Exception} from "@tsed/exceptions";
import {Middleware, MiddlewareMethods} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";
import {PlatformMulterField, PlatformMulterSettings} from "../config";
import {PlatformApplication} from "../services/PlatformApplication";

export interface MulterInputOptions {
  fields: PlatformMulterField[];
}

/**
 * @middleware
 */
@Middleware()
export class PlatformMulterMiddleware implements MiddlewareMethods {
  @Constant("multer", {})
  settings: PlatformMulterSettings;

  @Inject()
  app: PlatformApplication;

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
      throw er.code ? new Exception(er.code, `${er.message} ${er.field || ""}`.trim()) : er;
    }
  }

  protected getFields(conf: MulterInputOptions) {
    return conf.fields.map(({name, maxCount}) => ({name, maxCount}));
  }
}
