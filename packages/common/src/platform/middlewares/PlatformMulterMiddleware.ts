import {Constant, Inject} from "@tsed/di";
import {Exception} from "@tsed/exceptions";
import {Context} from "@tsed/platform-params";
import {PlatformMulterField, PlatformMulterSettings} from "../../config";
import {Middleware} from "../../mvc/decorators/class/middleware";
import {IMiddleware} from "../../mvc/interfaces/IMiddleware";
import {PlatformApplication} from "../services/PlatformApplication";

export interface MulterInputOptions {
  fields: PlatformMulterField[];
}

/**
 * @middleware
 */
@Middleware()
export class PlatformMulterMiddleware implements IMiddleware {
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

      const middleware = this.app.multer(settings).fields(this.getFields({fields}));

      return await middleware(ctx.getRequest(), ctx.getResponse());
    } catch (er) {
      throw er.code ? new Exception(er.code, `${er.message} ${er.field || ""}`.trim()) : er;
    }
  }

  protected getFields(conf: MulterInputOptions) {
    return conf.fields.map(({name, maxCount}) => ({name, maxCount}));
  }
}
