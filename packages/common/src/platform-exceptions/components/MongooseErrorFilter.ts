import {BadRequest} from "@tsed/exceptions";
import {PlatformContext} from "../../platform/domain/PlatformContext";
import {Catch} from "../decorators/catch";
import {ErrorFilter} from "./ErrorFilter";

@Catch("MongooseError", "MongoError")
export class MongooseErrorFilter extends ErrorFilter {
  catch(error: Error, ctx: PlatformContext) {
    return super.catch(new BadRequest(error.message, error), ctx);
  }
}
