import {ancestorsOf} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {ResourceNotFound} from "../errors/ResourceNotFound";
import {PlatformContext} from "../../platform/domain/PlatformContext";
import "../components/ErrorFilter";
import "../components/ExceptionFilter";
import "../components/StringErrorFilter";
import {getExceptionTypes} from "../domain/ExceptionTypesContainer";

/**
 * Catch all errors and return the json error with the right status code when it's possible.
 *
 * @platform
 */
@Injectable()
export class PlatformExceptions {
  types = getExceptionTypes();

  catch(error: unknown, ctx: PlatformContext) {
    const target = ancestorsOf(error)
      .reverse()
      .find((target) => this.types.has(target));

    if (target) {
      return this.types.get(target)!.catch(error, ctx);
    }
  }

  resourceNotFound(ctx: PlatformContext) {
    return this.catch(new ResourceNotFound(ctx.request.url), ctx);
  }
}
