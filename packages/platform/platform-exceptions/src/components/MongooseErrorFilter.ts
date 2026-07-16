import {BadRequest} from "@tsed/exceptions";
import {BaseContext} from "@tsed/di";
import {Catch} from "../decorators/catch.js";
import {ErrorFilter} from "./ErrorFilter.js";

@Catch("MongooseError", "MongoError")
export class MongooseErrorFilter extends ErrorFilter {
  catch(error: Error, ctx: BaseContext) {
    return super.catch(new BadRequest(error.message, error), ctx);
  }
}
