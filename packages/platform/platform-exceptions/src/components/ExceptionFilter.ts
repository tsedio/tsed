import {BaseContext} from "@tsed/di";
import {Exception} from "@tsed/exceptions";

import {Catch} from "../decorators/catch.js";
import {ErrorFilter} from "./ErrorFilter.js";

@Catch(Exception)
export class ExceptionFilter extends ErrorFilter {
  catch(error: Exception, ctx: BaseContext) {
    const {response, env} = ctx;
    const err = this.mapError(error, env);

    response.setHeaders(this.getHeaders(error)).contentType("application/json").status(error.status).body(err);
  }
}
