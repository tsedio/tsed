import {BaseContext, constant, inject, injectable} from "@tsed/di";
import {PLATFORM_CONTENT_TYPES_CONTAINER} from "./PlatformContentTypesContainer.js";
import {PLATFORM_CONTENT_TYPE_RESOLVER} from "./PlatformContentTypeResolver.js";
import {TemplateRenderError} from "../errors/TemplateRenderError.js";
import {isSerializable, type MaybePromise} from "@tsed/core";
import {serialize} from "@tsed/json-mapper";

/**
 * PlatformResponseFilter is responsible for transforming the response data
 * to the appropriate format based on the endpoint metadata and context.
 *
 * @platform
 */
export class PlatformResponseFilter {
  protected additionalProperties = constant<boolean>("additionalProperties");
  protected container = inject(PLATFORM_CONTENT_TYPES_CONTAINER);
  protected contentTypeResolver = inject(PLATFORM_CONTENT_TYPE_RESOLVER);
  #isExtended?: boolean;

  /**
   * Transform the data to the right format, like {@link PlatformResponseFilter.transform}, without waiting for a
   * microtask when every step is synchronous.
   *
   * A promise is returned when the endpoint renders a view, when a content-type response filter returns a promise,
   * or when a subclass overrides `transform()`, `serialize()` or `renderView()` (the subclass is then called through
   * `transform()`).
   *
   * @param data The data to transform.
   * @param $ctx The context.
   * @returns The transformed data, or a promise of it.
   */
  resolveBody(data: unknown, $ctx: BaseContext): MaybePromise<unknown> {
    if (this.isExtended()) {
      return this.transform(data, $ctx);
    }

    const {endpoint} = $ctx;

    if (endpoint) {
      if (endpoint.view) {
        return this.renderView(data, $ctx).then((html) => this.resolve(html, $ctx));
      }

      if (isSerializable(data)) {
        data = this.serializeData(data, $ctx);
      }
    }

    return this.resolve(data, $ctx);
  }

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
      throw new TemplateRenderError(endpoint.targetName, endpoint.propertyKey, err as Error);
    }
  }

  /**
   * Serialize data before calling filters
   * @param data
   * @param ctx
   */
  protected async serialize(data: unknown, ctx: BaseContext) {
    return this.serializeData(data, ctx);
  }

  private serializeData(data: unknown, ctx: BaseContext) {
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

  // a subclass overriding a step keeps going through transform(), as before resolveBody() existed
  private isExtended() {
    if (this.#isExtended === undefined) {
      const proto = PlatformResponseFilter.prototype;

      this.#isExtended = this.transform !== proto.transform || this.serialize !== proto.serialize || this.renderView !== proto.renderView;
    }

    return this.#isExtended;
  }

  protected getIncludes(ctx: BaseContext) {
    if (ctx.request.query.includes) {
      return [].concat(ctx.request.query.includes).flatMap((include: string) => include.split(","));
    }

    return undefined;
  }
}

injectable(PlatformResponseFilter);
