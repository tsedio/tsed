import {Exception} from "@tsed/exceptions";
import type {PlatformContext} from "../../platform/domain/PlatformContext";
import {Catch} from "../decorators/catch";
import {ErrorFilter} from "./ErrorFilter";

@Catch(Exception)
export class ExceptionFilter extends ErrorFilter {
  catch(error: Exception, ctx: PlatformContext) {
    const {response, logger, env} = ctx;
    const err = this.mapError(error, env);
    logger.error({
      error: err,
      stack: error.stack
    });

    response.setHeaders(this.getHeaders(error)).contentType("application/json").status(error.status).body(err);
  }
}
