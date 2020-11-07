import {ancestorsOf, classOf, nameOf} from "@tsed/core";
import {Inject, Injectable, InjectorService} from "@tsed/di";
import {PlatformContext} from "../../platform/domain/PlatformContext";
import "../components/ErrorFilter";
import "../components/ExceptionFilter";
import "../components/StringErrorFilter";
import "../components/MongooseErrorFilter";
import {ExceptionFilterKey, ExceptionFiltersContainer} from "../domain/ExceptionFiltersContainer";
import {ResourceNotFound} from "../errors/ResourceNotFound";
import {ExceptionFilterMethods} from "../interfaces/ExceptionFilterMethods";

/**
 * Catch all errors and return the json error with the right status code when it's possible.
 *
 * @platform
 */
@Injectable()
export class PlatformExceptions {
  types: Map<ExceptionFilterKey, ExceptionFilterMethods> = new Map();

  @Inject()
  injector: InjectorService;

  $onInit() {
    ExceptionFiltersContainer.forEach((token, type) => {
      this.types.set(type, this.injector.get(token)!);
    });
  }

  catch(error: unknown, ctx: PlatformContext) {
    const name = nameOf(classOf(error));

    if (name && this.types.has(name)) {
      return this.types.get(name)!.catch(error, ctx);
    }

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
