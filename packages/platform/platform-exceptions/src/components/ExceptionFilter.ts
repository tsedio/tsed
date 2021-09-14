import {BaseContext} from "@tsed/di";
import {Exception} from "@tsed/exceptions";
import {Catch} from "../decorators/catch";
import {ErrorFilter} from "./ErrorFilter";

@Catch(Exception)
export class ExceptionFilter extends ErrorFilter {
  catch(error: Exception, ctx: BaseContext) {
    const {response, logger, env} = ctx;
    const err = this.mapError(error, env);
    logger.error({
      error: err,
      stack: error.stack
    });

    response.setHeaders(this.getHeaders(error)).contentType("application/json").status(error.status).body(err);
  }
}
