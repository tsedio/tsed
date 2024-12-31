import {isSerializable} from "@tsed/core";
import {BaseContext, constant, inject, injectable} from "@tsed/di";
import {serialize} from "@tsed/json-mapper";

import {TemplateRenderError} from "../errors/TemplateRenderError.js";
import {PLATFORM_CONTENT_TYPE_RESOLVER} from "./PlatformContentTypeResolver.js";
import {PLATFORM_CONTENT_TYPES_CONTAINER} from "./PlatformContentTypesContainer.js";

/**
 * PlatformResponseFilter is responsible for transforming the response data
 * to the appropriate format based on the endpoint metadata and context.
 *
 * @platform
 */
export class PlatformResponseFilter {
  protected additionalProperties = constant<boolean>("additionalProperties");
  protected container = inject<PLATFORM_CONTENT_TYPES_CONTAINER>(PLATFORM_CONTENT_TYPES_CONTAINER);
  protected contentTypeResolver = inject<PLATFORM_CONTENT_TYPE_RESOLVER>(PLATFORM_CONTENT_TYPE_RESOLVER);

  /**
   * Transform the data to the right format.
   * @param data The data to transform.
   * @param $ctx The context.
   */
  async transform(data: unknown, $ctx: BaseContext): Promise<unknown> {
    const {endpoint} = $ctx;

    if (endpoint) {
      if (endpoint.view) {
        data = await this.renderView(data, $ctx);
      } else if (isSerializable(data)) {
        data = await this.serialize(data, $ctx);
      }
    }

    return this.resolve(data, $ctx);
  }

  /**
   * Render the view with the given data.
   * @param data The data to render.
   * @param $ctx The context.
   * @protected
   */
  protected async renderView(data: unknown, $ctx: BaseContext) {
    const {response, endpoint} = $ctx;
    try {
      const {path, options} = endpoint.view;

      return await response.render(path, {...options, ...(data as object), $ctx});
    } catch (err) {
      throw new TemplateRenderError(endpoint.targetName, endpoint.propertyKey, err);
    }
  }

  /**
   * Serialize data before calling filters
   * @param data
   * @param ctx
   */
  protected async serialize(data: unknown, ctx: BaseContext) {
    const {response, endpoint} = ctx;

    const responseOpts = endpoint.getResponseOptions(response.statusCode, {
      includes: this.getIncludes(ctx)
    });

    data = serialize(data, {
      useAlias: true,
      additionalProperties: this.additionalProperties,
      ...responseOpts,
      endpoint: true
    });

    return data;
  }

  protected resolve(data: any, ctx: BaseContext) {
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

  protected getIncludes(ctx: BaseContext) {
    if (ctx.request.query.includes) {
      return [].concat(ctx.request.query.includes).flatMap((include: string) => include.split(","));
    }

    return undefined;
  }
}

injectable(PlatformResponseFilter);
