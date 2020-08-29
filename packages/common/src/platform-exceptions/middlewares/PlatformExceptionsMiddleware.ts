import {classOf} from "@tsed/core";
import {Exception} from "@tsed/exceptions";
import {Middleware} from "../../mvc/decorators/class/middleware";
import {Err} from "../../mvc/decorators/params/error";
import {IMiddleware} from "../../mvc/interfaces/IMiddleware";
import {Context} from "../../platform/decorators/context";
import "../components/ErrorFilter";
import "../components/ExceptionFilter";
import "../components/StringErrorFilter";
import {getExceptionTypes} from "../domain/ExceptionTypesContainer";

/**
 * Catch all errors and return the json error with the right status code when it's possible.
 * @middleware
 * @platform
 */
@Middleware()
export class PlatformExceptionsMiddleware implements IMiddleware {
  types = getExceptionTypes();

  use(@Err() error: any, @Context() ctx: Context): any {
    const exceptionFilter = this.types.get(classOf(error));

    if (exceptionFilter) {
      return exceptionFilter.catch(error, ctx);
    }

    if (error instanceof Exception || error.status) {
      return this.types.get(Exception)!.catch(error, ctx);
    }

    return this.types.get(Error)!.catch(error, ctx);
  }
}
