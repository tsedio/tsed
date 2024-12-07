import {isSerializable} from "@tsed/core";
import {BaseContext, constant, inject, injectable} from "@tsed/di";
import {serialize} from "@tsed/json-mapper";

import {renderView} from "../utils/renderView.js";
import {PLATFORM_CONTENT_TYPE_RESOLVER} from "./PlatformContentTypeResolver.js";
import {PLATFORM_CONTENT_TYPES_CONTAINER} from "./PlatformContentTypesContainer.js";

/**
 * @platform
 */
export class PlatformResponseFilter {
  protected additionalProperties = constant<boolean>("additionalProperties");
  protected container = inject<PLATFORM_CONTENT_TYPES_CONTAINER>(PLATFORM_CONTENT_TYPES_CONTAINER);
  protected contentTypeResolver = inject<PLATFORM_CONTENT_TYPE_RESOLVER>(PLATFORM_CONTENT_TYPE_RESOLVER);

  /**
   * Call filters to transform data
   * @param data
   * @param ctx
   */
  transform(data: unknown, ctx: BaseContext) {
    const {response} = ctx;

    if (ctx.endpoint?.operation) {
      const bestContentType = this.contentTypeResolver(data, ctx);

      bestContentType && response.contentType(bestContentType);

      const resolved = this.container.resolve(bestContentType);

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

  private getIncludes(ctx: BaseContext) {
    if (ctx.request.query.includes) {
      return [].concat(ctx.request.query.includes).flatMap((include: string) => include.split(","));
    }

    return undefined;
  }
}

injectable(PlatformResponseFilter);
