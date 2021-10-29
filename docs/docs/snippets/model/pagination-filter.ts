import {PlatformContext} from "@tsed/common";
import {ResponseFilter, ResponseFilterMethods} from "@tsed/platform-response-filter";
import {Pagination} from "../models/Pagination";

@ResponseFilter("application/json")
class PaginationFilter implements ResponseFilterMethods {
  transform(data: unknown, ctx: PlatformContext): any {
    if (ctx.data instanceof Pagination) {// get the unserialized data
      if (ctx.data.isPaginated) {
        ctx.response.status(206);
      }
    }

    return data;
  }
}
