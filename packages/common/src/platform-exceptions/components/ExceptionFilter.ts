import {Exception} from "@tsed/exceptions";
import type {RequestContext} from "../../platform/domain/RequestContext";
import {Catch} from "../decorators/catch";
import {ErrorFilter} from "./ErrorFilter";

@Catch(Exception)
export class ExceptionFilter extends ErrorFilter {
  catch(error: Exception, ctx: RequestContext) {
    const {response, logger} = ctx;
    const err = this.mapError(error);

    logger.error({
      error: err
    });

    response.setHeaders(this.getHeaders(error)).status(error.status).body(err);
  }
}
