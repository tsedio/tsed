import {OverrideProvider} from "@tsed/di";
import {ParamMetadata, ParamTypes} from "../../mvc";
import {HandlerContext} from "../../platform/domain/HandlerContext";
import {PlatformHandler} from "../../platform/services/PlatformHandler";

@OverrideProvider(PlatformHandler)
export class PlatformExpressHandler extends PlatformHandler {
  /**
   * Get param from the context
   * @param param
   * @param context
   */
  getParam(param: ParamMetadata, context: HandlerContext) {
    switch (param.paramType) {
      case ParamTypes.BODY:
        return context.request.body;

      case ParamTypes.QUERY:
        return context.request.query;

      case ParamTypes.PATH:
        return context.request.params;

      case ParamTypes.HEADER:
        return context.request.headers;

      case ParamTypes.COOKIES:
        return context.request.cookies;

      case ParamTypes.SESSION:
        return context.request.session;

      case ParamTypes.LOCALS:
        return context.response.locals;

      default:
        return super.getParam(param, context);
    }
  }
}
