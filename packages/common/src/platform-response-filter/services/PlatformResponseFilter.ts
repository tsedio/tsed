import {isObject, Type} from "@tsed/core";
import {Constant, Inject, Injectable, InjectorService} from "@tsed/di";
import {PlatformContext} from "../../platform/domain/PlatformContext";
import {ResponseFilterKey, ResponseFiltersContainer} from "../domain/ResponseFiltersContainer";
import {ResponseFilterMethods} from "../interfaces/ResponseFilterMethods";

const ANY_CONTENT_TYPE = "*/*";

/**
 * @ignore
 */
export function getContentType(data: any, ctx: PlatformContext) {
  const {endpoint, response} = ctx;
  const {operation} = endpoint;

  const contentType = response.getContentType() || operation.getContentTypeOf(response.statusCode) || "";

  if (contentType && contentType !== ANY_CONTENT_TYPE) {
    if (contentType === "application/json") {
      if (isObject(data)) {
        return contentType;
      }
    } else {
      return contentType;
    }
  }

  if (typeof data === "string" && endpoint.view) {
    return "text/html";
  }
}

/**
 * @platform
 */
@Injectable()
export class PlatformResponseFilter {
  types: Map<ResponseFilterKey, ResponseFilterMethods> = new Map();

  @Inject()
  injector: InjectorService;

  @Constant("responseFilters", [])
  protected responseFilters: Type<ResponseFilterMethods>[];

  get contentTypes(): ResponseFilterKey[] {
    return [...this.types.keys()];
  }

  $onInit() {
    ResponseFiltersContainer.forEach((token, type) => {
      if (this.responseFilters.includes(token)) {
        this.types.set(type, this.injector.get(token)!);
      }
    });
  }

  getBestContentType(data: any, ctx: PlatformContext) {
    const contentType = getContentType(data, ctx);

    if (ctx.request.get("Accept")) {
      const bestContentType = ctx.request.accepts([contentType].concat(this.contentTypes).filter(Boolean));

      if (bestContentType) {
        return [].concat(bestContentType as any).filter((type) => type !== "*/*")[0];
      }
    }

    return contentType;
  }

  transform(data: unknown, ctx: PlatformContext) {
    const {response} = ctx;
    const bestContentType = this.getBestContentType(data, ctx);

    bestContentType && response.contentType(bestContentType);

    if (this.types.has(bestContentType)) {
      return this.types.get(bestContentType)!.transform(data, ctx);
    }

    if (this.types.has(ANY_CONTENT_TYPE)) {
      return this.types.get(ANY_CONTENT_TYPE)!.transform(data, ctx);
    }

    return data;
  }
}
