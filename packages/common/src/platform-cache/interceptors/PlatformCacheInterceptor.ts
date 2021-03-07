import {descriptorOf, isClass, isPrimitive, isString, nameOf, prototypeOf, Store} from "@tsed/core";
import {Inject, Interceptor, InterceptorContext, InterceptorMethods, InterceptorNext} from "@tsed/di";
import {serialize} from "@tsed/json-mapper";
import {JsonEntityStore} from "@tsed/schema";
import {IncomingMessage, ServerResponse} from "http";
import {PlatformContext} from "../../platform/domain/PlatformContext";
import {PlatformCachedObject} from "../interfaces/PlatformCachedObject";
import {PlatformCacheOptions} from "../interfaces/PlatformCacheOptions";
import {PlatformCache} from "../services/PlatformCache";

const cleanHeaders = (headers: Record<string, unknown>) => {
  return Object.entries(headers)
    .filter(([key]) => !["content-length", "x-request-id", "cache-control"].includes(key))
    .reduce((headers, [key, value]) => {
      return {
        ...headers,
        [key]: value
      };
    }, {});
};

/**
 * @platform
 */
@Interceptor()
export class PlatformCacheInterceptor implements InterceptorMethods {
  @Inject()
  protected cache: PlatformCache;

  async intercept(context: InterceptorContext<any, PlatformCacheOptions>, next: InterceptorNext) {
    if (!this.isEndpoint(context)) {
      return this.cacheMethod(context, next);
    }

    return this.cacheResponse(context, next);
  }

  protected getArgs(context: InterceptorContext<unknown, PlatformCacheOptions>) {
    return context.args
      .filter((arg) => {
        if (arg instanceof PlatformContext || arg instanceof IncomingMessage || arg instanceof ServerResponse) {
          return false;
        }

        return isPrimitive(arg) || isClass(arg);
      })
      .map((arg) => {
        return isClass(arg) ? serialize(arg) : arg;
      });
  }

  protected isEndpoint({target, propertyKey}: InterceptorContext<any, PlatformCacheOptions>) {
    const descriptor = descriptorOf(prototypeOf(target), propertyKey);
    const store = Store.from(prototypeOf(target), propertyKey, descriptor);

    return store.has(JsonEntityStore);
  }

  protected cacheMethod(context: InterceptorContext<any, PlatformCacheOptions>, next: InterceptorNext) {
    const {ttl, key: k = this.cache.defaultKeyResolver()} = context.options || {};
    const keyArgs = isString(k) ? k : k(this.getArgs(context));
    const key = [nameOf(context.target), context.propertyKey, keyArgs].join(":");

    return this.cache.wrap(key, next, {
      ttl: ttl as number
    });
  }

  protected async cacheResponse(context: InterceptorContext<any, PlatformCacheOptions>, next: InterceptorNext) {
    const $ctx = context.args.find((arg) => arg instanceof PlatformContext);
    const {request, response} = $ctx;

    if (request.method !== "GET") {
      return next();
    }

    const {ttl, key: k = this.cache.defaultKeyResolver()} = context.options || {};
    const args = this.getArgs(context);

    const keyArgs = isString(k) ? k : k(this.getArgs(context), $ctx);
    const key = [request.method, request.url, keyArgs].join(":");
    const cachedObject = await this.cache.get<PlatformCachedObject>(key);

    if (cachedObject && !(response.get("cache-control") === "no-cache")) {
      const {headers, data, expires} = cachedObject;

      const requestEtag = request.get("if-none-match");

      if (requestEtag && headers.etag === requestEtag) {
        response.status(304).setHeaders(headers).body(undefined);

        return undefined;
      }

      $ctx.response
        .setHeaders({
          ...headers,
          "x-cached": "true",
          "cache-control": `max-age=${(expires - Date.now()).toFixed(0)}`
        })
        .body(data);

      return cachedObject.data;
    }

    const result = await next();

    const calculatedTtl = this.cache.ttl(result, ttl);
    const expires = calculatedTtl + Date.now() / 1000;
    $ctx.response.setHeaders({
      "cache-control": `max-age=${expires.toFixed(0)}`
    });

    // cache final response with his headers and body
    response.onEnd(async () => {
      const data = response.getBody();
      const headers = cleanHeaders(response.getHeaders());

      await this.cache.set<PlatformCachedObject>(
        key,
        {
          ttl: calculatedTtl,
          args,
          data,
          expires,
          headers
        },
        {
          ttl: calculatedTtl
        }
      );
    });

    return result;
  }
}
