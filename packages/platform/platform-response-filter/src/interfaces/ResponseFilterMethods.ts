import type {Type} from "@tsed/core";
import type {BaseContext} from "@tsed/di";

declare global {
  namespace TsED {
    interface Configuration {
      /**
       * A list of response filters must be called before returning a response to the consumer. See more on [Response filters](/docs/response-filter.md).
       */
      responseFilters: Type<ResponseFilterMethods>[];
    }
  }
}

export interface ResponseFilterMethods<T = unknown> {
  transform(data: T, ctx: BaseContext): any;
}
