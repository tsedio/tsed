import {ancestorsOf} from "@tsed/core";
import {Inject} from "@tsed/di";
import {Middleware} from "../../mvc/decorators/class/middleware";
import {Err} from "../../mvc/decorators/params/error";
import {IMiddleware} from "../../mvc/interfaces/IMiddleware";
import {Context} from "../../platform/decorators/context";
import {getExceptionTypes} from "../domain/ExceptionTypesContainer";
import {GlobalErrorHandlerMiddleware} from "./GlobalErrorHandlerMiddleware";

/**
 * Catch all errors and return the json error with the right status code when it's possible.
 * @middleware
 * @platform
 */
@Middleware()
export class PlatformExceptionsMiddleware implements IMiddleware {
  @Inject()
  middleware: GlobalErrorHandlerMiddleware;

  types = getExceptionTypes();

  use(@Err() error: any, @Context() ctx: Context): any {
    const target = ancestorsOf(error)
      .reverse()
      .find((target) => this.types.has(target));

    if (target) {
      return this.types.get(target)!.catch(error, ctx);
    }

    throw error;
  }
}
