import {isSerializable, Type} from "@tsed/core";
import {BaseContext, Constant, Inject, Injectable, InjectorService} from "@tsed/di";
import {serialize} from "@tsed/json-mapper";

import {ResponseFilterKey, ResponseFiltersContainer} from "../domain/ResponseFiltersContainer.js";
import {ResponseFilterMethods} from "../interfaces/ResponseFilterMethods.js";
import {ANY_CONTENT_TYPE, getContentType} from "../utils/getContentType.js";
import {renderView} from "../utils/renderView.js";

/**
 * @platform
 */
@Injectable()
export class PlatformResponseFilter {
  protected types: Map<ResponseFilterKey, ResponseFilterMethods> = new Map();

  @Inject()
  protected injector: InjectorService;

  @Constant("responseFilters", [])
  protected responseFilters: Type<ResponseFilterMethods>[];

  @Constant("additionalProperties")
  protected additionalProperties: boolean;

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

  getBestContentType(data: any, ctx: BaseContext) {
    const contentType = getContentType(data, ctx);

    if (ctx.request.get("Accept")) {
      const bestContentType = ctx.request.accepts([contentType].concat(this.contentTypes).filter(Boolean));

      if (bestContentType) {
        return [].concat(bestContentType as any).filter((type) => type !== "*/*")[0];
      }
    }

    return contentType;
  }

  /**
   * Call filters to transform data
   * @param data
   * @param ctx
   */
  transform(data: unknown, ctx: BaseContext) {
    const {response} = ctx;

    if (ctx.endpoint?.operation) {
      const bestContentType = this.getBestContentType(data, ctx);

      bestContentType && response.contentType(bestContentType);

      if (this.types.has(bestContentType)) {
        return this.types.get(bestContentType)!.transform(data, ctx);
      }

      if (this.types.has(ANY_CONTENT_TYPE)) {
        return this.types.get(ANY_CONTENT_TYPE)!.transform(data, ctx);
      }
    }

    return data;
  }

  /**
   * Serialize data before calling filters
   * @param data
   * @param ctx
   */
  async serialize(data: unknown, ctx: BaseContext) {
    const {response, endpoint} = ctx;

    if (endpoint) {
      if (endpoint.view) {
        data = await renderView(data, ctx);
      } else if (isSerializable(data)) {
        const responseOpts = endpoint.getResponseOptions(response.statusCode, {
          includes: this.getIncludes(ctx)
        });

        data = serialize(data, {
          useAlias: true,
          additionalProperties: this.additionalProperties,
          ...responseOpts,
          endpoint: true
        });
      }
    }

    return data;
  }

  private getIncludes(ctx: BaseContext) {
    if (ctx.request.query.includes) {
      return [].concat(ctx.request.query.includes).flatMap((include: string) => include.split(","));
    }

    return undefined;
  }
}
