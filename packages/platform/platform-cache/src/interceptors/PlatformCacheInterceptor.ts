import {isClass, isString, nameOf, Store} from "@tsed/core";
import {BaseContext, DIContext, Inject, Interceptor, InterceptorContext, InterceptorMethods, InterceptorNext} from "@tsed/di";
import {deserialize, serialize} from "@tsed/json-mapper";
import {JsonEntityStore} from "@tsed/schema";
import {IncomingMessage, ServerResponse} from "http";
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

  async canRefreshInBackground(key: string, {refreshThreshold, ttl}: {refreshThreshold?: number; ttl: any}, next: Function) {
    const inQueue = await this.hasKeyInQueue(key);

    if (refreshThreshold && !inQueue) {
      await this.addKeyToQueue(key);

      const currentTTL = await this.cache.ttl(key);
      const calculatedTTL = this.cache.calculateTTL(currentTTL, ttl);

      if (currentTTL < calculatedTTL - refreshThreshold) {
        await next();
      }

      await this.deleteKeyFromQueue(key);
    }
  }

  async cacheMethod(context: InterceptorContext<any, PlatformCacheOptions>, next: InterceptorNext) {
    const {type, ttl, collectionType, refreshThreshold, keyArgs, args} = this.getOptions(context);
    const key = [nameOf(context.target), context.propertyKey, keyArgs].join(":");

    const cachedObject = await this.cache.getCachedObject(key);

    const set = (result: any) => {
      const calculatedTTL = this.cache.calculateTTL(result, ttl);
      const data = serialize(result, {type, collectionType});
      this.cache.setCachedObject(key, data, {args, ttl: calculatedTTL});
    };

    this.canRefreshInBackground(key, {refreshThreshold, ttl}, async () => {
      const result = await next();
      await set(result);
    });

    if (cachedObject) {
      const {data} = cachedObject;

      return deserialize(JSON.parse(data), {collectionType, type});
    }

    const result = await next();

    setTimeout(() => set(result));

    return result;
  }

  async cacheResponse(context: InterceptorContext<any, PlatformCacheOptions>, next: InterceptorNext) {
    const $ctx: BaseContext = context.args[context.args.length - 1];
    const {request, response} = $ctx;

    if (request.method !== "GET") {
      return next();
    }

    const {ttl, args, keyArgs} = this.getOptions(context);
    const key = [request.method, request.url, keyArgs].join(":");

    const cachedObject = await this.cache.getCachedObject(key);

    if (cachedObject && !(request.get("cache-control") === "no-cache")) {
      return this.sendResponse(cachedObject, $ctx);
    }

    const result = await next();

    const calculatedTTL = this.cache.calculateTTL(result, ttl);

    $ctx.response.setHeaders({
      "cache-control": `max-age=${calculatedTTL}`
    });

    // cache final response with his headers and body
    response.onEnd(async () => {
      this.cache.setCachedObject(key, response.getBody(), {
        ttl: calculatedTTL,
        args,
        headers: cleanHeaders(response.getHeaders())
      });
    });

    return result;
  }

  protected getArgs(context: InterceptorContext<unknown, PlatformCacheOptions>) {
    return context.args.reduce((args, arg) => {
      if (arg instanceof DIContext || arg instanceof IncomingMessage || arg instanceof ServerResponse) {
        return args;
      }

      if (isClass(arg)) {
        return args.concat(serialize(arg));
      }

      return args.concat(arg);
    }, []);
  }

  protected getOptions(context: InterceptorContext<any, PlatformCacheOptions>) {
    const {ttl, type, collectionType, key: k = this.cache.defaultKeyResolver(), refreshThreshold} = context.options || {};

    const args = this.getArgs(context);
    const keyArgs = isString(k) ? k : k(args);

    return {refreshThreshold, ttl, type, args, collectionType, keyArgs};
  }

  protected isEndpoint({target, propertyKey}: InterceptorContext<any, PlatformCacheOptions>) {
    return Store.fromMethod(target, propertyKey).has(JsonEntityStore);
  }

  protected async hasKeyInQueue(key: string) {
    return !!(await this.cache.get(`$$queue:${key}`));
  }

  protected async addKeyToQueue(key: string) {
    await this.cache.set(`$$queue:${key}`, true, {ttl: 120});
  }

  protected async deleteKeyFromQueue(key: string) {
    await this.cache.del(`$$queue:${key}`);
  }

  protected sendResponse(cachedObject: PlatformCachedObject, $ctx: BaseContext) {
    const {headers, ttl} = cachedObject;
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
        "cache-control": `max-age=${ttl}`
      })
      .body(data);

    return data;
  }
}
