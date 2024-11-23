import {ancestorsOf, classOf, nameOf} from "@tsed/core";
import {DIContext, inject, injectable, type TokenProvider} from "@tsed/di";

import {ErrorFilter} from "../components/ErrorFilter.js";
import {ExceptionFilter} from "../components/ExceptionFilter.js";
import {MongooseErrorFilter} from "../components/MongooseErrorFilter.js";
import {StringErrorFilter} from "../components/StringErrorFilter.js";
import {ExceptionFilterKey, ExceptionFiltersContainer} from "../domain/ExceptionFiltersContainer.js";
import {ResourceNotFound} from "../errors/ResourceNotFound.js";

/**
 * Catch all errors and return the json error with the right status code when it's possible.
 *
 * @platform
 */
export class PlatformExceptions {
  types: Map<ExceptionFilterKey, TokenProvider> = new Map();

  constructor() {
    ExceptionFiltersContainer.forEach((token, type) => {
      this.types.set(type, token);
    });
  }

  catch(error: unknown, ctx: DIContext) {
    return this.resolve(error, ctx).catch(error, ctx);
  }

  resourceNotFound(ctx: DIContext) {
    return this.catch(new ResourceNotFound(ctx.request.url), ctx);
  }

  protected resolve(error: any, ctx: DIContext) {
    const name = nameOf(classOf(error));

    if (name && this.types.has(name)) {
      return inject(this.types.get(name)!);
    }

    const target = ancestorsOf(error)
      .reverse()
      .find((target) => this.types.has(target));

    if (target) {
      return inject(this.types.get(target)!);
    }

    // default
    return inject(this.types.get(Error)!);
  }
}

injectable(PlatformExceptions).imports([ErrorFilter, ExceptionFilter, MongooseErrorFilter, StringErrorFilter]);
