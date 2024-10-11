import {PlatformContext} from "@tsed/platform-http";
import {ResponseFilter, ResponseFilterMethods} from "@tsed/platform-response-filter";
import {Pagination} from "../models/Pagination";

@ResponseFilter("application/json")
class PaginationFilter implements ResponseFilterMethods {
  transform(data: unknown, ctx: PlatformContext): any {
    if (ctx.data instanceof Pagination) {
      // /!\ don't modify the ctx.data. at this step, the serializer has already been called.

      if (ctx.data.totalCount > (ctx.data.pageable.page + 1) * ctx.data.pageable.size) {
        ctx.response.status(206);
        data.links.next = `${ctx.request.url}?page=${ctx.data.pageable.page + 1}&size=${ctx.data.pageable.size}`;
      }

      if (ctx.data.pageable.page > 0) {
        data.links.prev = `${ctx.request.url}?page=${ctx.data.pageable.page - 1}&size=${ctx.data.pageable.size}`;
      }
    }

    return data;
  }
}
