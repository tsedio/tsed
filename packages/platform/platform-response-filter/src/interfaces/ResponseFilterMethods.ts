import type {BaseContext} from "@tsed/di";
import {Type} from "@tsed/core";

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
