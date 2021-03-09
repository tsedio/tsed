import {isClass, isString, nameOf, Store} from "@tsed/core";
import {Inject, Interceptor, InterceptorContext, InterceptorMethods, InterceptorNext} from "@tsed/di";
import {deserialize, serialize} from "@tsed/json-mapper";
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
    if (this.cache.disabled()) {
      return next();
    }

    if (!this.isEndpoint(context)) {
      return this.cacheMethod(context, next);
    }

    return this.cacheResponse(context, next);
  }

  protected getArgs(context: InterceptorContext<unknown, PlatformCacheOptions>) {
    return context.args.reduce((args, arg) => {
      if (arg instanceof PlatformContext || arg instanceof IncomingMessage || arg instanceof ServerResponse) {
        return args;
      }

      if (isClass(arg)) {
        return args.concat(serialize(arg));
      }

      return args.concat(arg);
    }, []);
  }

  protected getOptions(context: InterceptorContext<any, PlatformCacheOptions>) {
    const {ttl, type, collectionType, key: k = this.cache.defaultKeyResolver()} = context.options || {};

    const args = this.getArgs(context);
    const keyArgs = isString(k) ? k : k(args);

    return {ttl, type, args, collectionType, keyArgs};
  }

  protected isEndpoint({target, propertyKey}: InterceptorContext<any, PlatformCacheOptions>) {
    return Store.fromMethod(target, propertyKey).has(JsonEntityStore);
  }

  protected async cacheMethod(context: InterceptorContext<any, PlatformCacheOptions>, next: InterceptorNext) {
    const {ttl, type, collectionType, keyArgs, args} = this.getOptions(context);
    const key = [nameOf(context.target), context.propertyKey, keyArgs].join(":");

    const cachedObject = await this.cache.get<PlatformCachedObject>(key);

    if (cachedObject) {
      const {data} = cachedObject;

      return deserialize(JSON.parse(data), {collectionType, type});
    }

    const result = await next();
    const calculatedTtl = this.cache.ttl(result, ttl);

    await this.cache.set<PlatformCachedObject>(
      key,
      {
        ttl: calculatedTtl,
        args,
        data: JSON.stringify(serialize(result, {type, collectionType}))
      },
      {
        ttl: calculatedTtl
      }
    );

    return result;
  }

  protected async cacheResponse(context: InterceptorContext<any, PlatformCacheOptions>, next: InterceptorNext) {
    const $ctx: PlatformContext = context.args[context.args.length - 1];
    const {request, response} = $ctx;

    if (request.method !== "GET") {
      return next();
    }

    const {ttl, args, keyArgs} = this.getOptions(context);

    const key = [request.method, request.url, keyArgs].join(":");

    const cachedObject = await this.cache.get<PlatformCachedObject>(key);

    if (cachedObject && !(response.get("cache-control") === "no-cache")) {
      return this.sendResponse(cachedObject, $ctx);
    }

    const result = await next();

    const calculatedTtl = this.cache.ttl(result, ttl);
    const expires = calculatedTtl + Date.now() / 1000;
    $ctx.response.setHeaders({
      "cache-control": `max-age=${expires.toFixed(0)}`
    });

    // cache final response with his headers and body
    response.onEnd(async () => {
      const data = JSON.stringify(response.getBody());
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

  protected sendResponse(cachedObject: PlatformCachedObject, $ctx: PlatformContext) {
    const {headers, expires} = cachedObject;
    const {request, response} = $ctx;

    const requestEtag = request.get("if-none-match");

    if (requestEtag && headers.etag === requestEtag) {
      response.status(304).setHeaders(headers).body(undefined);

      return undefined;
    }

    const data = JSON.parse(cachedObject.data);

    $ctx.response
      .setHeaders({
        ...headers,
        "x-cached": "true",
        "cache-control": `max-age=${(expires - Date.now()).toFixed(0)}`
      })
      .body(data);

    return data;
  }
}
