import {isSerializable, Type} from "@tsed/core";
import {BaseContext, constant, inject, injectable, TokenProvider} from "@tsed/di";
import {serialize} from "@tsed/json-mapper";

import {ResponseFilterKey, ResponseFiltersContainer} from "../domain/ResponseFiltersContainer.js";
import {ResponseFilterMethods} from "../interfaces/ResponseFilterMethods.js";
import {ANY_CONTENT_TYPE, getContentType} from "../utils/getContentType.js";
import {renderView} from "../utils/renderView.js";

/**
 * @platform
 */
export class PlatformResponseFilter {
  protected types: Map<ResponseFilterKey, TokenProvider> = new Map();
  protected responseFilters = constant<Type<ResponseFilterMethods>[]>("responseFilters", []);
  protected additionalProperties = constant<boolean>("additionalProperties");

  constructor() {
    ResponseFiltersContainer.forEach((token, type) => {
      if (this.responseFilters.includes(token)) {
        this.types.set(type, token);
      }
    });
  }

  get contentTypes(): ResponseFilterKey[] {
    return [...this.types.keys()];
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

      const resolved = this.resolve(bestContentType);

      if (resolved) {
        return resolved.transform(data, ctx);
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

  private resolve(bestContentType: string) {
    const token = this.types.get(bestContentType) || this.types.get(ANY_CONTENT_TYPE);

    if (token) {
      return inject<ResponseFilterMethods>(token);
    }
  }

  private getIncludes(ctx: BaseContext) {
    if (ctx.request.query.includes) {
      return [].concat(ctx.request.query.includes).flatMap((include: string) => include.split(","));
    }

    return undefined;
  }
}

injectable(PlatformResponseFilter);
