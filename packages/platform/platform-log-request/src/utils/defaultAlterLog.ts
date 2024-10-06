import type {BaseContext} from "@tsed/di";

export function defaultAlterLog(level: string, obj: Record<string, unknown>, ctx: BaseContext) {
  const minimalLog = {
    method: ctx.request.method,
    url: ctx.request.url,
    route: ctx.request.route || ctx.request.url,
    ...obj
  };

  if (level === "info") {
    return minimalLog;
  }

  return {
    ...minimalLog,
    headers: ctx.request.headers,
    body: ctx.request.body,
    query: ctx.request.query,
    params: ctx.request.params
  };
}
