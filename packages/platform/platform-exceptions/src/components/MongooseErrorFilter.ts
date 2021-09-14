import {BaseContext} from "@tsed/di";
import {BadRequest} from "@tsed/exceptions";
import {Catch} from "../decorators/catch";
import {ErrorFilter} from "./ErrorFilter";

@Catch("MongooseError", "MongoError")
export class MongooseErrorFilter extends ErrorFilter {
  catch(error: Error, ctx: BaseContext) {
    return super.catch(new BadRequest(error.message, error), ctx);
  }
}
