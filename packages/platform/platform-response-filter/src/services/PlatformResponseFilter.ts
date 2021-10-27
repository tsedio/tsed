import {isSerializable, Type} from "@tsed/core";
import {BaseContext, Constant, Inject, Injectable, InjectorService} from "@tsed/di";
import {renderView} from "@tsed/platform-views";
import {ResponseFilterKey, ResponseFiltersContainer} from "../domain/ResponseFiltersContainer";
import {ResponseFilterMethods} from "../interfaces/ResponseFilterMethods";
import {ANY_CONTENT_TYPE, getContentType} from "../utils/getContentType";
import {ConverterService} from "./ConverterService";

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
  async transform(data: unknown, ctx: BaseContext) {
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
        data = this.injector.get<ConverterService>(ConverterService)!.serialize(data, {
          ...endpoint.getResponseOptions(response.statusCode),
          endpoint: true
        });
      }
    }

    return data;
  }
}
